using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sandip.DAL;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace Sandip.Controllers
{
    public class LoginController : ApiController
    {
        [Route("api/UserLogin")]
        [HttpPost]
        public string UserLogin([FromBody] JObject request)
        {
            if (request!=null) {
                var user = JsonConvert.DeserializeObject<User>(request.ToString());
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var userDetails = db.Users.FirstOrDefault(u => u.EmployeeId == user.UserId && u.Password == user.Password && u.Status=="Active" && u.CompanyId== user.CompanyId);

                    if (userDetails != null)    //User was found
                    {
                        var result = db.prGetUsers(userDetails.Id, userDetails.Id, "Single").ToList();
                        var result1 = Newtonsoft.Json.JsonConvert.SerializeObject(result, Newtonsoft.Json.Formatting.Indented);
                        return result1;
                    }
                    else    //User was not found
                    {
                        var result = Newtonsoft.Json.JsonConvert.SerializeObject(null, Newtonsoft.Json.Formatting.Indented);
                        return result;
                    }
                }
            }
            else
            {
                var result = Newtonsoft.Json.JsonConvert.SerializeObject(null, Newtonsoft.Json.Formatting.Indented);
                return result;
            }

            return "";


        }

        [Route("api/UserLogin1")]
        [HttpGet]
        public string UserLogin1(int tst)
        {
            /*if (request != null)
            {
                var user = JsonConvert.DeserializeObject<Users>(request.ToString());
                using (LOANDB db = new LOANDB())
                {
                    var userDetails = db.Users.FirstOrDefault(u => u.UserID == user.UserID && u.Password == user.Password);

                    if (userDetails != null)    //User was found
                    {
                        var result = Newtonsoft.Json.JsonConvert.SerializeObject(userDetails, Newtonsoft.Json.Formatting.Indented);
                        return result;
                    }
                    else    //User was not found
                    {
                        var result = Newtonsoft.Json.JsonConvert.SerializeObject(null, Newtonsoft.Json.Formatting.Indented);
                        return result;
                    }
                }
            }
            else
            {
                var result = Newtonsoft.Json.JsonConvert.SerializeObject(null, Newtonsoft.Json.Formatting.Indented);
                return result;
            }*/

            return "";
        }
    }
}
