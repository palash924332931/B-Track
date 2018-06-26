import { HouseInformation,ContactInformation,InsuredPerson,CoBorrower } from "./index";

export class Customer{
    CustomerID :number;
    DOJ :string
    CustomerNo :string;
    FormNo :string;
    FirstName :string;
    MiddleName :string;
    LastName:string;
    AlliasName :string;
    HusbandName:string;
    HusbandAge:number;
    DOB :string;
    Age :number
    Religion :string;
    Caste :string;
    Gender :string;
    MaritalStatus :string;
    AgeProofCertificate :string;
    AgeProofCertificateNo :number;
    DocumentTypeID :number;
    DocumentNo :string;
    MotherName :string;
    FatherName :string;
    QualificationID :number;
    Qualification:string;
    OccupationID :number;
    Occupation :string;
    ActiveStatus :string;
    DeleteStatus :boolean
    AadharCardNo:string;
    NationalIDNo:string;
    PAN:string;
    EmailID:string;
    BloodGroup:string;
    IsEmployee:boolean;
    EmployeeID:number;
    Remark:string;
    UserID:number;
    LastUpdate:string;
    HouseDetails:HouseInformation;
    ContactDetails: ContactInformation;
    CoborrowerDetails: CoBorrower;
    InsuredDetails: InsuredPerson;
}