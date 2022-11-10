export interface User
{
    id       : string;
    imageUrl : string;
    locked   : boolean;
    birthday : Date;
    nickName?: string;
}