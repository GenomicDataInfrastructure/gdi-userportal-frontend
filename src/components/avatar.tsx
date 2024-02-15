import Image from "next/image";

type User = {
  name?: string;
  email?: string;
  image?: string;
};

type AvatarProps = {
  user?: User;
};

function getInitials(name: string | undefined | null) {
  if (!name) return "";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function Avatar({ user }: AvatarProps) {
  return (
    <div className="rounded-full bg-scampi-blue p-2 text-sm text-white hover:opacity-90">
      {user?.image ? (
        <Image src={user.image} alt="avatar" className="rounded-full" />
      ) : (
        <p>{getInitials(user?.name)}</p>
      )}
    </div>
  );
}

export default Avatar;
