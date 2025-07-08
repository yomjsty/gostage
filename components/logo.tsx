import Image from "next/image";
import logo from "@/public/logo-square.png"

export default function Logo() {
  return (
    <Image
      src={logo}
      alt="GoStage Logo"
      width={50}
      height={50}
    />
  )
}
