import LoginForm from "@/components/auth/login/LoginForm";
import { Suspense } from "react";

const Page = () => {
  return (
    <main className="min-h-screen bg-background px-6 pt-20 pb-12 md:flex md:items-center md:justify-center md:p-8">
      <div className="mx-auto w-full max-w-[480px] md:rounded-lg md:bg-surface md:px-10 md:py-8 md:shadow-card">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;
