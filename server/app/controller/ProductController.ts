import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../model/UserModel";
import { io } from "../..";
// import { io } from "../../index"; // import the Socket.IO server instance

export const PurchaseProduct = async (req: Request, res: Response) => {
  //   console.log("came");
  const userId = req.userId;

  //  Use session-based transaction only in production
  const useTransaction = process.env.NODE_ENV === "production";
  const session = useTransaction ? await mongoose.startSession() : null;

  try {
    if (useTransaction) session!.startTransaction();

    // Load buyer within session
    const user = useTransaction
      ? await UserModel.findById(userId).session(session!)
      : await UserModel.findById(userId);

    if (!user) {
      if (useTransaction) await session!.abortTransaction();
      return res.status(404).send("User not found");
    }

    // If no referrer, nothing to credit — just commit and return success.
    if (!user.referredBy) {
      if (useTransaction) await session!.commitTransaction();
      return res
        .status(200)
        .send("Purchase successful, no referral credits applied");
    }

    // Load referrer within session
    const referrer = useTransaction
      ? await UserModel.findOne({
          referralCode: user.referredBy,
        }).session(session!)
      : await UserModel.findOne({
          referralCode: user.referredBy,
        });

    if (!referrer) {
      // No referrer found — still commit/finish
      if (useTransaction) await session!.commitTransaction();
      return res
        .status(200)
        .send("Purchase successful, referring user not found");
    }

    // Find the referred entry for this user in referrer's array
    const referredIndex = (referrer.referredUser || []).findIndex(
      (entry) =>
        // compare ObjectIds safely
        entry.user?.toString() === user._id.toString()
    );

    // If not found or already converted, no credits applied
    if (
      referredIndex === -1 ||
      referrer.referredUser[referredIndex].status === "converted"
    ) {
      if (useTransaction) await session!.commitTransaction();

      return res
        .status(200)
        .send(
          "Purchase successful, no referral credit (already converted or not found)"
        );
    }

    // At this point: pending referral found -> credit both users and mark converted

    // ✅ Credit the referring user
    referrer.credits = (referrer.credits || 0) + 2;
    referrer.referredUser[referredIndex].status = "converted";

    if (useTransaction) {
      await referrer.save({ session: session! });
    } else {
      await referrer.save();
    }

    // ✅ Credit the buyer
    user.credits = (user.credits || 0) + 2;

    if (useTransaction) {
      await user.save({ session: session! });
    } else {
      await user.save();
    }

    // // ✅ Emit Socket.IO events to update frontend in real-time
    io.to(referrer._id.toString()).emit("UserUpdated", {
      user: {
        id: referrer._id,
        name: referrer.name,
        email: referrer.email,
        credits: referrer.credits,
        referralCode: referrer.referralCode,
        referredUsers: referrer.referredUser,
      },
    });
    io.to(user._id.toString()).emit("UserUpdated", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        referralCode: user.referralCode,
        referredUsers: user.referredUser,
      },
    });

    // commit the transaction and return
    if (useTransaction) await session!.commitTransaction();

    return res
      .status(200)
      .json({ msg: "Purchase successful, credits updated" });
  } catch (err) {
    if (useTransaction) await session!.abortTransaction();
    console.error("Error during purchase transaction:", err);
    return res.status(500).send("Internal Server Error: " + err);
  } finally {
    if (useTransaction) session!.endSession();
  }
};
