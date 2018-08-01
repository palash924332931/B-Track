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
    
    public partial class prGetDailyPaymentLog_Result
    {
        public int PaymentId { get; set; }
        public Nullable<int> CarLogId { get; set; }
        public string RegistrationNo { get; set; }
        public string CarType { get; set; }
        public string RootName { get; set; }
        public string DriverName { get; set; }
        public Nullable<decimal> Distance { get; set; }
        public Nullable<decimal> TotalDistance { get; set; }
        public Nullable<decimal> RootCost { get; set; }
        public Nullable<decimal> ExpectedCost { get; set; }
        public Nullable<decimal> TripNo { get; set; }
        public Nullable<bool> IsUnwantedReturn { get; set; }
        public string ReasonForReturn { get; set; }
        public string CheckInDate { get; set; }
        public string TripType { get; set; }
        public Nullable<int> PaySlipId { get; set; }
        public string SlipNo { get; set; }
        public string BookNo { get; set; }
        public Nullable<decimal> PaySlipAmount { get; set; }
        public Nullable<decimal> PaymentAmount { get; set; }
        public Nullable<decimal> SystemAmount { get; set; }
        public string Notes { get; set; }
        public string PaymentStatus { get; set; }
        public Nullable<int> ReceivedBy { get; set; }
        public Nullable<System.DateTime> ReceivedDate { get; set; }
        public string Status { get; set; }
        public Nullable<System.DateTime> Update { get; set; }
        public string CreatedBy { get; set; }
        public string ReceivedByName { get; set; }
        public string PaymentType { get; set; }
        public Nullable<decimal> ReceivedOnRouteIncome { get; set; }
        public Nullable<decimal> ReceivedDifferentRouteIncome { get; set; }
        public Nullable<decimal> OnRouteIncome { get; set; }
        public Nullable<decimal> DifferentRouteIncome { get; set; }
        public Nullable<decimal> TotalIncome { get; set; }
    }
}
