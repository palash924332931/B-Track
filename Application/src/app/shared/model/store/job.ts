export class Job{
    JobId :number;
    JobCreatedBy :number;
    JobCreatedByName:string;
    JobedById:number;
    JobDate:string;
    SMApprovedStatus:string;
    ManagerApprovedStatus:string;
    SMApprovedDate:string;
    ManagerApprovedDate:string;
    JobCompletedStatus:string;
    JobDescription:string;
    JobCompletedDate:string;
    BusStatus:string;
    Remark:string;
    FinalApprovalPerson:string;
    RegistrationNo:string;
    CarId:number;
    Created:string;
    CreatedBy:number;
    CompanyId:string;
    Status:string;
    AssignedMacanic:number;
    AssignedMacanicName:string;
    Parts?:JobDetails[];
}

interface JobDetails{
    Id:number;
    JobId:number;
    PartsId:number;
    PartsName:string;
    PartsSize:string;
    UnitPrice:number;
    Quantity:number;
    VendorId:number;
    VendorName:string;
    Status:string;
    Balance:number;

}