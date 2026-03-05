import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  name: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="p-[20px]">
      <h1 className="mb-[24px] text-[32px] font-semibold">Пользователи</h1>
      <div className="flex flex-col gap-[12px]">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-[16px] bg-white px-[20px] py-[16px]"
          >
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-[14px] text-[#626C77]">{user.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
