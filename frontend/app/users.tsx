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

  const deleteUser = async (id: number) => {
    await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
    const res = await fetch("http://localhost:3000/users");
    setUsers(await res.json());
  };

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
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-100 px-4 hover:bg-red-200 py-2 text-[14px] font-medium text-red-500"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
