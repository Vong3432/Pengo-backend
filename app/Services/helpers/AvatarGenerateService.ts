import AvatarGenerateInterface, { AvatarGenerateOption } from "Contracts/interfaces/AvatarGenerate.interface"

class AvatarGenerateService implements AvatarGenerateInterface {
    getAvatar(name: string, option?: AvatarGenerateOption): string | null {
        let dicebearURL = "https://avatars.dicebear.com/api/"
        if(option?.avatar) dicebearURL += `${option.avatar}/`
        if(option?.gender) dicebearURL += `${option.gender}/`
        return dicebearURL += `${name}.svg`
    }
}

export default new AvatarGenerateService()