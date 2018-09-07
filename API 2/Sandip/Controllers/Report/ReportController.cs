using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers.Report
{
    public class ReportController : ApiController
    {
        [Route("api/GetDailyCarTypesReport")]
        [HttpGet]
        public HttpResponseMessage GetDailyCarTypesReport(int UserId,  DateTime date)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetDailyCarTypesReport(UserId, date).ToList(); 
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete root cost information. Please try agian.");
            }
        }

        [Route("api/GetDailyCarLogReport")]
        [HttpGet]
        public HttpResponseMessage GetDailyCarLogReport(int UserId, DateTime date)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetDailyCarLogReport(UserId, date).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete root cost information. Please try agian.");
            }
        }

        [Route("api/GetDashboardReport")]
        [HttpGet]
        public HttpResponseMessage GetDashboardReport(int UserId, DateTime date)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetDashboardReport(UserId, date).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete root cost information. Please try agian.");
            }
        }

        [Route("api/GetMonthlyIncomeReport")]
        [HttpGet]
        public HttpResponseMessage GetMonthlyIncomeReport(int UserId, DateTime FromDate,DateTime ToDate,string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetMonthlyIncomeReportDateRange(UserId, FromDate, ToDate, Type).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete root cost information. Please try agian.");
            }
        }

        [Route("api/GetDailyPaymentReportSection")]
        [HttpGet]
        public HttpResponseMessage GetDailyPaymentReportSection(int UserId, DateTime SelectedDate,int CarTypeId, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetDailyPaymentReportSection(UserId, SelectedDate, CarTypeId, Type).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show information. Please try agian.");
            }
        }

        [Route("api/GetIncomeReportDateRange")]
        [HttpGet]
        public HttpResponseMessage GetIncomeReportDateRange(int UserId, DateTime FromDate,DateTime ToDate, int CarTypeId, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetIncomeReportDateRange(UserId, FromDate, ToDate, CarTypeId, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show information. Please try agian.");
            }
        }

        [Route("api/GetMonthlyIncomeRouteWiseReport")]
        [HttpGet]
        public HttpResponseMessage GetMonthlyIncomeRouteWiseReport(int UserId, DateTime FromDate, DateTime ToDate, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetMonthlyIncomeReportRouteWise(UserId, FromDate, ToDate, Type).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show information. Please try agian.");
            }
        }

        [Route("api/GetIncomeReportDateRangeBusWiseSection")]
        [HttpGet]
        public HttpResponseMessage GetIncomeReportDateRangeBusWiseSection(int UserId, DateTime FromDate, DateTime ToDate,int RouteId, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetIncomeReportDateRangeBusWiseSection(UserId, FromDate, ToDate,RouteId, Type).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show information. Please try agian.");
            }
        }

        [Route("api/GetBusPaymentHistory")]
        [HttpGet]
        public HttpResponseMessage GetBusPaymentHistory(int UserId, DateTime FromDate, DateTime ToDate, int RouteId, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetBusPaymentHistory(UserId, FromDate, ToDate, RouteId, Type).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show information. Please try agian.");
            }
        }


        [Route("api/GetReportSectionDateRange")]
        [HttpGet]
        public HttpResponseMessage GetReportSectionDateRange(int UserId, DateTime FromDate, DateTime ToDate, int RouteId, int CarId, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetReportSectionDateRange(UserId, FromDate, ToDate, RouteId,CarId, Type).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show information. Please try agian.");
            }
        }

        [Route("api/GetBusReportDateRangeRouteWise")]
        [HttpGet]
        public HttpResponseMessage GetBusReportDateRangeRouteWise(int UserId, DateTime FromDate, DateTime ToDate, int CarId, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetMonthlyBusReportRouteWise(UserId, FromDate, ToDate, CarId, Type).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show information. Please try agian.");
            }
        }

        [Route("api/GetMonthlyIncomeExpenseReport")]
        [HttpGet]
        public HttpResponseMessage GetMonthlyIncomeExpenseReport(int UserId, DateTime FromDate, DateTime ToDate, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnresult = db.prGetIncomeExpenseReport(UserId, FromDate, ToDate, Type).ToList(); ;
                    return Request.CreateResponse(HttpStatusCode.OK, returnresult);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete root cost information. Please try agian.");
            }
        }
    }
}
