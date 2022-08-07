//export class User {
//    id: number;
//    username: string;
//    firstName: string;
//    lastName: string;
//    token?: string;
//}

export class User {
  name: string;
  tzNumber: number;
  address: {
    city: string;
    street: string;
    house: number;
    zip: number;
  }
  packages: Package[]; 
  token?: string;
 }

export class Package {
  public name: string;
  isActive: boolean;
  start: string;
  end: string;
}
