const token=localStorage.getItem("cmsToken");
const user=JSON.parse(localStorage.getItem("cmsUser")||"null");
if(!token||!user||user.role!=="admin"){location.replace("admin-login.html");}
const authHeaders={Authorization:"Bearer "+token};
function adminLogout(){localStorage.removeItem("cmsToken");localStorage.removeItem("cmsUser");location.replace("admin-login.html");}
async function adminFetch(url,options={}){
  options.headers={...(options.headers||{}),...authHeaders};
  const response=await fetch(url,options);
  if(response.status===401||response.status===403){adminLogout();throw new Error("Admin session expired");}
  return response;
}