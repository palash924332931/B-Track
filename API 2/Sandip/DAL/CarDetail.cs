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
    
    public partial class CarDetail
    {
        public int CarId { get; set; }
        public string RegistrationNo { get; set; }
        public Nullable<System.DateTime> RegistrationDate { get; set; }
        public Nullable<int> CompanyId { get; set; }
        public Nullable<int> CarTypeId { get; set; }
        public string Status { get; set; }
        public string ReasonForStop { get; set; }
        public Nullable<System.DateTime> OnRootDate { get; set; }
        public Nullable<decimal> TotalDistance { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> Update { get; set; }
        public string Notes { get; set; }
        public string NoOfSeat { get; set; }
        public Nullable<System.DateTime> Creation { get; set; }
        public string RegistrationNoBangla { get; set; }
    }
}
