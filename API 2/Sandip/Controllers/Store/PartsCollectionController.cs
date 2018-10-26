using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sandip.DAL;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Sandip.Services;
using Sandip.Repositories.PartsRepositories;

namespace Sandip.Controllers.Store
{
    public class PartsCollectionController : ApiController
    {
        private CommonService _commonService = new CommonService();
        private User _user;
        [Route("api/store/PostStoreParts")]
        [HttpPost]
        public HttpResponseMessage PostStoreParts([FromBody] JObject request) {
            var partsDetails = JsonConvert.DeserializeObject<PartsDetail>(request.ToString());
            try
            {
                _user = _commonService.GetUserById(Convert.ToInt32(partsDetails.CreatedBy));
                PartsUnitOfWork unit = new PartsUnitOfWork(_user);
                unit.InsertPartsDetail(partsDetails);
                return Request.CreateResponse(HttpStatusCode.OK, _user.Language=="bn"?"সফল ভাবে সংরক্ষিত হয়েছে।":"Saved successfully.");
            }
            catch (Exception ex)
            {               
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }            
        }
       
    }
}
