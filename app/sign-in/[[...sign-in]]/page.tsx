import { SignIn } from '@clerk/nextjs';

function SignInPage() {
  return (
    <div className="mt-20 flex justify-center">
      <SignIn />
    </div>
  );
}
export default SignInPage;
