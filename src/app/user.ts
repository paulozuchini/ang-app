import { UserAddress } from "./userAddress";
import { Company } from "./company";

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: UserAddress;
    phone: string;
    website: string;
    company: Company;
}