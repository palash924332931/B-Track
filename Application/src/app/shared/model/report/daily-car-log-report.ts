export class DailyCarLogReport{
    CarTypeId :number;
    Type :string;
    Description :string;
    Status:string;
    CreatedBy:number;
    Name:string;
    UpdatedTime:string;
    NoOfCar:string;
    NoOfRepairCar:string;
    NoOfHeavyRepairCar:string;
    NoOfOnRootCar:string; 
    ReceivedAmount:string;
    NoOfPaidCar:number;
    NoOfDueCar:number;  
    TodayReceivedAmount?:  number; 
}