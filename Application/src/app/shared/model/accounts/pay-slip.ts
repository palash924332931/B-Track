
export class PaySlip{
    PaySlipId:number;
    SlipNo:string;
    EndSlipNo?:number;
    BookNo:string;
    Amount:number;
    ReceivedAmount:number;
    ApprovedBy:number;
    ApprovedByName:string;
    UsedBy:number;
    UsedByName:string;
    UsedDate:string;
    CompanyId:number;
    Status:string;
    CreatedBy:number;
    CreatedByName:string;
    Update:string;
    NumberOfSlip?:number;
    NoOfUsedSlip?:number;
    NoOfPayslipUsedOrApproved?:number;
}