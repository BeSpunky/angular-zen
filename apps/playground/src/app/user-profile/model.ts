export interface User
{
    id       : string;
    imageUrl : string;
    locked   : boolean;
    birthdate: Date;
    nickName?: string;
}