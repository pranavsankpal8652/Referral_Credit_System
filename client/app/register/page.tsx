// app/register/page.tsx
import AuthForm from "@/Components/AuthForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { r?: string };
}) {
  const params = await searchParams;
  const referralCode = await params.r;
  // console.log(referralCode);
  return <AuthForm mode="register" referralFromUrl={referralCode} />;
}
