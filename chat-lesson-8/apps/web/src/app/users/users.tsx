/* eslint-disable-next-line */
export interface UsersProps {
  id: number;
  firstName: string;
  avatar: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export function Users(props: UsersProps) {
  return (
    <div>
      <h1>Users</h1>
    </div>
  );
}

export default Users;
