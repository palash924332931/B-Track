using Sandip.DAL;
using Sandip.Repositories.PartsCollectionRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sandip.Repositories.PartsRepositories
{
    public class PartsUnitOfWork
    {
        private CarSystemEntities _context;
        private readonly PartsDetailsRepository _partsDetailsRepo;
        private readonly StoreInfoRepository _storeInfoRepo;
        private User _user;
        public PartsUnitOfWork(User user)
        {
            _user = user;
            _context = new CarSystemEntities();
            _partsDetailsRepo = new PartsDetailsRepository(_context, _user);
            _storeInfoRepo = new StoreInfoRepository(_context, _user);
        }

        public int InsertPartsDetail(PartsDetail partsDetail)
        {
            try
            {
                var id = 0;
                decimal unitPrice=0;
                partsDetail.CompanyId = _user.CompanyId;
                foreach (var item in partsDetail.StoreInfoes)
                {
                    item.CompanyId = _user.CompanyId;
                    item.PartsId = partsDetail.PartsId;
                    unitPrice =(decimal) item.UnitPrice;
                }
                partsDetail.UnitPrice = unitPrice;
                if (partsDetail.PartsId > 0)
                {
                    var storeInf = partsDetail.StoreInfoes.FirstOrDefault();
                    partsDetail.StoreInfoes = null;                   
                    id = _partsDetailsRepo.UpdatePartsDetail(partsDetail);
                    _storeInfoRepo.InsertStoreInfo(storeInf);
                    _storeInfoRepo.save();
                }
                else
                {
                    id = _partsDetailsRepo.InsertPartsDetail(partsDetail);
                }
                return id;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}