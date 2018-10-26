using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sandip.DAL;
using System.Data.Entity.Migrations;

namespace Sandip.Repositories.PartsCollectionRepository
{
    public class PartsDetailsRepository
    {
        private CarSystemEntities _context;
        private User _user;

        public PartsDetailsRepository(CarSystemEntities context, User user) {
            _context = context;
            _user = user;
        }

        public IEnumerable<PartsDetail> GetPartsDetails()
        {
            return _context.PartsDetails.Where(x => x.CompanyId == _user.CompanyId).ToList();
        }

        public PartsDetail GetPartsDetailById(int partsId)
        {
            return _context.PartsDetails.Where(x => x.PartsId == partsId).FirstOrDefault();
        }

        public int InsertPartsDetail(PartsDetail partsDetail)
        {
            _context.PartsDetails.Add(partsDetail);
            _context.SaveChanges();
            return partsDetail.PartsId;
        }

        public int UpdatePartsDetail(PartsDetail partsDetail)
        {
            _context.PartsDetails.AddOrUpdate(partsDetail);
            _context.SaveChanges();
            return 1;
        }

    }
}