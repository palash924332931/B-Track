using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sandip.DAL;
using System.Data.Entity.Migrations;

namespace Sandip.Repositories.PartsRepositories
{
    public class StoreInfoRepository
    {
        private CarSystemEntities _context;
        private User _user;

        public StoreInfoRepository(CarSystemEntities context, User user)
        {
            _context = context;
            _user = user;
        }

        public IEnumerable<StoreInfo> GetStoreInfo()
        {
            return _context.StoreInfoes.Where(x => x.CompanyId == _user.CompanyId).ToList();
        }

        public StoreInfo GetStoreInfoById(int storeInfoId)
        {
            return _context.StoreInfoes.Where(x => x.StoreInfoId == storeInfoId).FirstOrDefault();
        }

        public int InsertStoreInfo(StoreInfo storeInfo)
        {
            _context.StoreInfoes.Add(storeInfo);
            return storeInfo.StoreInfoId;
        }

        public int UpdateStoreInfo(StoreInfo storeInfo)
        {
            _context.StoreInfoes.AddOrUpdate(storeInfo);
            return 1;
        }

        public void save()
        {
            _context.SaveChanges();
        }
    }
}