//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Sandip.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class User
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }
        public string EmployeeId { get; set; }
        public string Name { get; set; }
        public string NameInBangla { get; set; }
        public string PresentAddress { get; set; }
        public string PermanentAddress { get; set; }
        public Nullable<int> RoleId { get; set; }
        public string Status { get; set; }
        public string ContactNo { get; set; }
        public Nullable<int> CompanyId { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> Update { get; set; }
        public string Language { get; set; }
        public Nullable<System.DateTime> CorpJoinDate { get; set; }
        public Nullable<System.DateTime> DepotJoinDate { get; set; }
        public Nullable<System.DateTime> RetirementDate { get; set; }
        public Nullable<System.DateTime> DateOfBirth { get; set; }
        public string Grade { get; set; }
        public string FatherName { get; set; }
        public Nullable<System.DateTime> Creation { get; set; }
    }
}
