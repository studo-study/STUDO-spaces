import Image from "next/image";

interface AvatarProps {
  img_url?: string;
  displayName: string;
  id: string;
  size?: number;
}

const gradients = [
  "from-rose-500 to-orange-500",
  "from-violet-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-yellow-500",
  "from-indigo-500 to-blue-500",
  "from-fuchsia-500 to-purple-500",
  "from-teal-500 to-green-500",
  "from-orange-500 to-red-500",
  "from-cyan-500 to-sky-500",
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const Avatar = ({ img_url, displayName, id, size = 36 }: AvatarProps) => {
  const fontSize = size * 0.38;

  if (img_url) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Image
          src={img_url}
          width={size}
          height={size}
          title={displayName}
          className="rounded-full object-cover"
          style={{ width: size, height: size, minWidth: size, minHeight: size }}
          alt={displayName}
        />
      </div>
    );
  }

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("");
  const gradient = gradients[hashId(id) % gradients.length];

  return (
    <div
      className={`rounded-full items-center justify-center flex bg-linear-0 ${gradient}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <span className="font-bold uppercase" style={{ fontSize }}>
        {initials}
      </span>
    </div>
  );
};

Avatar.displayName = "Avatar";
export default Avatar;
