import {Company} from "./Company.ts";

export default interface User {
    uuid: string;
    name: string;
    email: string;
    avatar_url: string;
    company: Company;
}