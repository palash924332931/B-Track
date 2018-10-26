
import {StoreInfo} from './store-info'
export  class PartsDetails{
    PartsId:number;
    PartsCode:string;
    PartsName:string;
    PartsDescription:string;
    PartsSize:string;
    Brand:string;
    VendorId:number;
    VendorName:string;
    CarTypeId:number;
    CarTypeName:string;
    UnitPrice:number;
    Units:string;
    Status:string;
    Remark:string;
    CreatedByName:string;
    CreatedBy:number;
    Created:string;
    Updated:Date;
    CompanyId:number;
	RackNo:string;
    StoreInfoes:StoreInfo[];
}