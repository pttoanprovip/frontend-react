import RegisterForm from "../compoment/auth/RegisterForm";

export default function Register() {
  return (
    <div
      className="min-h-screen min-w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://imgs.search.brave.com/dcQEbNfYMH59R-ONhPiYdZuCV06BmDDoRVb7JyFUuEQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA2LzMzLzUzLzQz/LzM2MF9GXzYzMzUz/NDM1N19XUG53SHlO/NGlQNGFhVmVyQmcx/aVNhTjhDUHI0bEZh/cC5qcGc')`,
      }}
    >
      <div className="w-full max-w-md mr-10">
        <RegisterForm />
      </div>
    </div>
  );
}
