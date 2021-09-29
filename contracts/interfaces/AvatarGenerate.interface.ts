type AvatarType = "micah" | "identicon"
type GenderType = "male" | "female"

export type AvatarGenerateOption = {
    avatar?: AvatarType,
    gender?: GenderType
}

export default interface AvatarGenerateInterface {
    getAvatar(name: string, option?: AvatarGenerateOption): string | null
}
