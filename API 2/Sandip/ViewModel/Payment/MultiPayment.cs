using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sandip.ViewModel.Payment
{
    public class MultiPayment
    {
        public List<prGetIncomeReportDateRangeBusWiseSection_Result> CarList { get; set; }
        public prGetDailyPaymentLog_Result PaymentLog { get; set; }
    }
}