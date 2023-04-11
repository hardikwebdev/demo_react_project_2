import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const ACCEPT_INVITATION = "/accept-invitation";
export const REGISTER_USER = "/register-user";
export const GET_EMAIL_FROM_TOKEN = "/getEmailFromToken";

export const LOGIN_URL = "/admin/auth/login";
export const FORGOT_PASSWORD_URL = "/admin/auth/forgotPassword";
export const CHANGE_PASSWORD_URL = "/admin/auth/changePassword";

export const LOGOUT_URL = "/admin/auth/logout";

export const GET_USER = "/admin/";
export const EDIT_PROFILE = "/admin/editUser";
export const RESET_PWD = "/admin/updatePassword";

export const GET_EFFECTIVE_USERS_LIST = "/admin/users/effectiveUsers";
export const GET_USERS_LIST = "/admin/users";
export const GET_ALL_USERS_LIST = "/admin/users/allUsers";
export const ADD_USER = "/admin/users/add";
export const ADD_USER_IMG = "/admin/users/addUserImg";
export const EDIT_USER_IMG = "/admin/users/editUserImg";
export const ADD_QR_CODE = "/admin/users/addQRCode";
export const DELETE_QR_CODE = "/admin/users/deleteQRCode";
export const EDIT_USER_URL = "/admin/users/editUser";
export const DELETE_USER_URL = "/admin/users/deleteUser";
export const INVITE_USER = "/admin/users/invite-user";
export const RESEND_INVITATION = "/admin/users/resendInvitation";
export const HANDLE_USER_STATUS = "/admin/users/handleUserStatus";
export const GET_IMPORTED = "/admin/users/importedUsers";
export const IMPORT_USER_FILE = "/admin/users/importUserFile";
export const LOGIN_LOGS = "/admin/users/loginLogs";

export const GET_ALL_PROJECTS_LIST = "/admin/projects/allProjects";
export const GET_PROJECTS_LIST = "/admin/projects";
export const ADD_PROJECTS = "/admin/projects/add";
export const EDIT_PROJECTS = "/admin/projects/edit";
export const DELETE_PROJECTS = "/admin/projects/delete";
export const GET_ALL_ORDERS = "/admin/projects/getAllOrders";
export const UPDATE_ORDER_STATUS = "/admin/projects/updateOrderStatus";
export const EXPORT_ORDER_CSV = "/admin/projects/exportOrdersCSV";
export const CREATE_CSV_REQUEST = "/admin/projects/createCSVRequest";
export const GET_CSV_REQUEST_LIST = "/admin/projects/getCSVRequestList";
export const DELETE_CSV = "/admin/projects/deleteCSV";
export const RESUBMIT_CSV_REQUEST = "/admin/projects/resubmitRequest";
export const DOWNLOAD_ORDER_CSV = "/admin/projects/downloadcsv";
export const DELETE_ORDER_CSV = "/admin/projects/deletecsvfile";
export const GET_VISITATION_HISTORY = "/admin/projects/visitationLogs";
export const GET_TRADE_LIST = "/admin/projects/getTradeList";

export const GET_ALL_BRAND_LIST = "/admin/products/allBrands";
export const GET_BRAND_LIST = "/admin/products/brandList";
export const ADD_BRAND = "/admin/products/addBrand";
export const EDIT_BRAND = "/admin/products/editBrand";
export const DELETE_BRAND = "/admin/products/deleteBrand";

export const GET_BRAND_VARIANT = "/admin/general/brands_variant";
export const ADD_BRAND_VARIANT = "/admin/general/brands_variant";
export const UPDATE_BRAND_VARIANT = "/admin/general/update_brands_variant";
export const DELETE_BRAND_VARIANT = "/admin/general/delete_brands_variant";

export const GET_CATEGORY_LIST = "/admin/category";
export const ADD_CATEGORY = "/admin/category/addCategory";
export const EDIT_CATEGORY = "/admin/category/editCategory";
export const GET_ALL_CATEGORIES = "/admin/category/getAllCategories";
export const DELETE_CATEGORY = "/admin/category/deleteCategory";

export const GET_PROJECT_OUTLET_LIST = "/admin/outlets/";
export const GET_OUTLET_LIST = "/admin/outlets/list";
export const GET_ALL_OUTLET_LIST = "/admin/outlets/getAllList";
export const ADD_OUTLET = "/admin/outlets/createOutlet";
export const EDIT_OUTLET = "/admin/outlets/editOutlet";
export const EDIT_OUTLET_STATUS = "/admin/outlets/editOutletStatus";
export const DELETE_OUTLET = "/admin/outlets/deleteOutlet";
export const ASSIGN_OUTLET = "/admin/outlets/assignOutlet";
export const UNASSIGN_OUTLET = "/admin/outlets/unassignOutlet";
export const OUTLET_SUMMARY = "/admin/outlets/outlet_summary";

export const GET_ROLE_LIST = "/admin/roles";
export const ADD_ROLE = "/admin/roles/addRole";
export const EDIT_ROLE = "/admin/roles/editRole";
export const GET_ALL_ROLES = "/admin/roles/getAllRoles";
export const DELETE_ROLE = "/admin/roles/deleteRole";

export const GET_REGIONS_LIST = "/admin/regions";
export const GET_PARENTREGIONS_LIST = "/admin/regions/parentRegions";
export const ADD_REGION = "/admin/regions/addRegion";
export const EDIT_REGION = "/admin/regions/editRegion";
export const GET_ALL_REGIONS = "/admin/regions/getAllRegions";
export const DELETE_REGION = "/admin/regions/deleteRegion";

export const GET_SUBCATEGORIES = "/admin/category/getSubcategories";
export const ADD_SUBCATEGORY = "/admin/category/addSubCategory";
export const EDIT_SUBCATEGORY = "/admin/category/editSubCategory";
export const DELETE_SUBCATEGORY = "/admin/category/deleteSubCategory";

export const GET_EXERCISE_LIST = "/admin/exercise";
export const ADD_EXERCISE = "/admin/exercise/addExercise";
export const EDIT_EXERCISE = "/admin/exercise/editExercise";
export const EDIT_EXERCISE_IMG = "/admin/exercise/editExerciseImg";
export const ADD_EXERCISE_IMG = "/admin/exercise/addExerciseImg";
export const DELETE_EXERCISE_IMG = "/admin/exercise/deleteExerciseImg";
export const DELETE_EXERCISE = "/admin/exercise/deleteExercise"
export const HANDLE_EXERCISE_STATUS = "/admin/exercise/handleExerciseStatus";
export const GET_ALL_EXERCISES = "/admin/exercise/getAllExercises";

export const GET_PRODUCT_LIST = "/admin/products/productList";
export const ADD_PRODUCT = "/admin/products/addProduct";
export const ADD_PRODUCT_IMG = "/admin/products/addProductImg";
export const EDIT_PRODUCT = "/admin/products/editProduct";
export const EDIT_PRODUCT_IMG = "/admin/products/editProductImg";
export const DELETE_PRODUCT = "/admin/products/deleteProduct";

export const GET_REDEEM_LIST = "/admin/products/redeemHistory";

export const GET_USER_EXERCISE = "/admin/exercise/getUsersExercises";
export const ASSIGN_TO_USER = "/admin/exercise/assignToUser";
export const GET_CONFIG = "/admin/general/";
export const UPDATE_CONFIG = "/admin/general/update";

export const GET_ADDRESS = "/admin/outlets/getAddress";

export const GET_STOCK_DETAIL = "/admin/projects/getStockDetail";
export const GET_PRODUCT_STOCK_LIST = "/admin/projects/getProductStockList";
export const GET_PROJECT_STOCK_LIST = "/admin/projects/getProductStockListByProjects";

export const UPDATE_STOCK = "/admin/projects/updateStock";

export const EXPORT_EFFECTIVE_USERS_CSV = "/admin/users/exportEffectiveUsersCSV";
export const EXPORT_OUTLET = "admin/outlets/exportOutlet";
export const IMPORT_OUTLET = "admin/outlets/importScript";
export const GET_RANDOM_ACC = "admin/outlets/getRandomAcc";
export const IMPORT_SCRIPT_STATUS = "admin/outlets/checkImportScriptStatus";

export const GET_QUESTIONNAIRES_LIST = "/admin/questionnaires/questionnairesList";
export const ADD_QUESTIONNAIRES = "/admin/questionnaires/addQuestionnaires";
export const EDIT_QUESTIONNAIRES = "/admin/questionnaires/editQuestionnaires";
export const DELETE_QUESTIONNAIRES = "/admin/questionnaires/deleteQuestionnaires";

export const API = axios.create({
  baseURL: API_BASE_URL
});

export function getConfig(token) {
  return API.get(GET_CONFIG, { headers: { "Authorization": token } });
}

export function updateConfig(token, data) {
  return API.post(UPDATE_CONFIG, data, { headers: { "Authorization": token } });
}

export async function getAddress(token, data) {
  return API.post(GET_ADDRESS, data, { headers: { "Authorization": token } });
}

export function acceptInvitation(values, email, password) {
  let data = JSON.stringify({
    token: values.token,
    email: email,
    password: password
  });
  return API.post(ACCEPT_INVITATION, data, { headers: { "Content-Type": "application/json" } });
}

export function registerUser(data) {
  return API.post(REGISTER_USER, data, { headers: { "Content-Type": "application/json" } });
}

export function resendInvitation(token, data) {
  return API.post(RESEND_INVITATION, data, { headers: { "Authorization": token } });
}

export function login(username, password) {
  let data = JSON.stringify({
    email: username,
    password: password
  });
  return API.post(LOGIN_URL, data, { headers: { "Content-Type": "application/json" } });
}

export function forgotPassword(email) {
  let data = JSON.stringify({
    email: email
  });
  return API.post(FORGOT_PASSWORD_URL, data, { headers: { "Content-Type": "application/json" } });
}

export function changePassword(values, password) {

  let data = JSON.stringify({
    email: values.email,
    token: values.resetToken,
    password: password
  });
  return API.post(CHANGE_PASSWORD_URL, data, { headers: { "Content-Type": "application/json" } });
}

export async function getUserByToken(token) {
  // Authorization head should be fulfilled in interceptor.
  return API.get(GET_USER, { headers: { "Authorization": token } });
}

// export async function updatePassword(data, authToken) {
//   return API.post(UPDATE_PASSWORD, data, { headers: { 'Authorization': authToken } });
// }

export async function editUser(authToken, data) {
  return API.post(EDIT_USER_URL, data, { headers: { "Authorization": authToken } });
}

export async function deleteUser(authToken, data) {
  return API.post(DELETE_USER_URL, data, { headers: { "Authorization": authToken } });
}

export async function getUsersList(token, searchData, limit, sortBy, sortOrder, page, startDate, endDate, status, admin_users, region_id) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sDate = (startDate !== undefined && startDate !== null) ? startDate : "";
  var eDate = (endDate !== undefined && endDate !== null) ? endDate : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  var admin_user = admin_users ? admin_users === 1 ? 1 : 0 : 0;
  var region_ids = admin_user ? admin_user === 1 ? region_id : "" : "";
  return API.get(GET_USERS_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + "&startDate=" + sDate +
    "&endDate=" + eDate + "&status=" + sValue + "&admin_users=" + admin_user + "&region_id=" + region_ids, { headers: { "Authorization": token } });
}

export async function getEffectiveUsersList(token, searchData, limit, sortBy, sortOrder, page, isEffective) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var effective = (isEffective !== undefined && isEffective !== null) ? isEffective : "";
  return API.get(GET_EFFECTIVE_USERS_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + "&isEffective=" + effective, { headers: { "Authorization": token } });
}

export async function getAllUsersList(token, region_id) {
  var region_ids = region_id ? region_id : "";
  return API.get(GET_ALL_USERS_LIST + '?region_id=' + region_ids, { headers: { "Authorization": token } });
}

export function getEmailFromToken(data) {
  return API.get(GET_EMAIL_FROM_TOKEN + '?token=' + data, { headers: { "Content-Type": "application/json" } })
}

export async function addUser(token, data) {
  return API.post(ADD_USER, data, { headers: { "Authorization": token, "Content-Type": "multipart/form-data" } });
}

export async function editUserImg(authToken, data) {
  return API.post(EDIT_USER_IMG, data, {
    headers: {
      "Authorization": authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function addQRCode(authToken, data) {
  return API.post(ADD_QR_CODE, data, {
    headers: {
      "Authorization": authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function deleteQRCode(authToken, data) {
  return API.post(DELETE_QR_CODE, data, {
    headers: {
      "Authorization": authToken,
    }
  });
}

export async function editProfile(token, data) {
  return API.post(EDIT_PROFILE, data, { headers: { "Authorization": token } });
}

export async function resetPwdAdmin(token, data) {
  return API.post(RESET_PWD, data, { headers: { "Authorization": token } });
}

export async function inviteUser(token, data) {
  return API.post(INVITE_USER, data, { headers: { "Authorization": token } });
}

export async function handleUserStatus(token, data) {
  return API.post(HANDLE_USER_STATUS, data, { headers: { "Authorization": token } });
}

export async function getProjectsList(token, searchData, limit, sortBy, sortOrder, page, typeF, user_id, category) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var type = (typeF !== undefined && typeF !== null) ? typeF : "";
  var userId = (user_id !== undefined && user_id !== null) ? user_id : "";
  var category_id = (category !== undefined && category !== null) ? category : "";
  // var eDate = (endDate !== undefined && endDate !== null) ? endDate : "";
  // var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_PROJECTS_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + type + '&user_id=' + userId + '&category_id=' + category_id, { headers: { "Authorization": token } });
}


export async function getAllOrders(token, searchData, limit, sortBy, sortOrder, page, typeF, user_id, project_id,
  outlet_id, userRole, allowedUser, userRegion) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var type = (typeF !== undefined && typeF !== null) ? typeF : "";
  var userId = (user_id !== undefined && user_id !== null) ? user_id : "";
  var projectId = (project_id !== undefined && project_id !== null) ? project_id : "";
  var outletId = (outlet_id !== undefined && outlet_id !== null) ? outlet_id : "";
  var region = (userRegion !== undefined && userRegion !== null) ? userRegion : "";

  // var eDate = (endDate !== undefined && endDate !== null) ? endDate : "";
  // var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_ALL_ORDERS + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + type + '&user_id='
    + userId + '&project_id=' + projectId + '&outlet_id=' + outletId + '&user_role=' + userRole + '&allowed_user=' +
    allowedUser + '&user_region=' + region, { headers: { "Authorization": token } });
}


export async function updateOrderStatus(token, data) {
  return API.post(UPDATE_ORDER_STATUS, data, { headers: { "Authorization": token } });
}

export async function exportOrdersCSV(token, data) {
  data.search = (data.search !== undefined && data.search !== null) ? data.search : "";
  data.user_id = (data.user_id !== undefined && data.user_id !== null) ? data.user_id : "";
  data.project_id = (data.project_id !== undefined && data.project_id !== null) ? data.project_id : "";
  data.outlet_id = (data.outlet_id !== undefined && data.outlet_id !== null) ? data.outlet_id : "";
  data.statusF = (data.statusF !== undefined && data.statusF !== null) ? data.statusF : "";

  return API.post(EXPORT_ORDER_CSV, data, { headers: { "Authorization": token } });
}


export async function downloadOrdersCSV(token) {
  return API.get(DOWNLOAD_ORDER_CSV, { headers: { "Authorization": token } });
}

export async function deleteOrdersCSV(token) {
  return API.get(DELETE_ORDER_CSV, { headers: { "Authorization": token } });
}

export async function exportEffectiveUsersCSV(token, data) {
  return API.post(EXPORT_EFFECTIVE_USERS_CSV, data, { headers: { "Authorization": token } });
}

export async function getSubcategories(token, searchData, limit, sortBy, sortOrder, page, categoryFilter) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  // var sDate = (startDate !== undefined && startDate !== null) ? startDate : "";
  // var eDate = (endDate !== undefined && endDate !== null) ? endDate : "";
  var cValue = (categoryFilter !== undefined && categoryFilter !== null) ? categoryFilter : "";
  return API.get(GET_SUBCATEGORIES + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + "&categoryFilter=" + cValue, { headers: { "Authorization": token } });
}

export async function getAllProjectsList(token, user_region) {
  var region = (user_region !== undefined && user_region !== null) ? user_region : "";
  return API.get(GET_ALL_PROJECTS_LIST + '?user_region=' + region, { headers: { "Authorization": token } });
}

export async function addProjects(authToken, data) {
  return API.post(ADD_PROJECTS, data, { headers: { "Authorization": authToken } });
}

export async function editProjects(authToken, data) {
  return API.post(EDIT_PROJECTS, data, { headers: { "Authorization": authToken } });
}

export async function deleteProjects(authToken, data) {
  return API.post(DELETE_PROJECTS, data, { headers: { "Authorization": authToken } });
}

export async function addSubCategory(authToken, data) {
  return API.post(ADD_SUBCATEGORY, data, { headers: { "Authorization": authToken } });
}

export async function editSubCategory(authToken, data) {
  return API.post(EDIT_SUBCATEGORY, data, { headers: { "Authorization": authToken } });
}

export async function deleteSubCategory(authToken, data) {
  return API.post(DELETE_SUBCATEGORY, data, { headers: { "Authorization": authToken } });
}

export async function getExerciseList(token, searchData, limit, sortBy, sortOrder, page, startDate, endDate, status,
  categoryFilter, subcategoryFilter) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sDate = (startDate !== undefined && startDate !== null) ? startDate : "";
  var eDate = (endDate !== undefined && endDate !== null) ? endDate : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  var cValue = (categoryFilter !== undefined && categoryFilter !== null) ? categoryFilter : "";
  var subF = (subcategoryFilter !== undefined && subcategoryFilter !== null) ? subcategoryFilter : "";
  return API.get(GET_EXERCISE_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + "&startDate=" + sDate +
    "&endDate=" + eDate + "&status=" + sValue + "&categoryFilter=" + cValue + "&subcategoryFilter=" + subF, { headers: { "Authorization": token } });
}

export async function getAllCategories(authToken) {
  return API.get(GET_ALL_CATEGORIES, { headers: { "Authorization": authToken } });
}

export async function addExercise(authToken, data) {
  return API.post(ADD_EXERCISE, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function addExerciseImg(authToken, data, postdata) {
  return API.post(ADD_EXERCISE_IMG + '?postdata=' + postdata, data, {
    headers: {
      "Authorization": authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function deleteExercise(authToken, data) {
  return API.post(DELETE_EXERCISE, data, { headers: { "Authorization": authToken } });
}

export async function handleExerciseStatus(token, data) {
  return API.post(HANDLE_EXERCISE_STATUS, data, { headers: { "Authorization": token } });
}

export async function editExercise(token, data) {
  return API.post(EDIT_EXERCISE, data, { headers: { "Authorization": token } });
}

export async function deleteExerciseImg(token, data) {
  return API.post(DELETE_EXERCISE_IMG, data, { headers: { "Authorization": token } });
}

export async function editExerciseImg(authToken, data, postdata) {
  return API.post(EDIT_EXERCISE_IMG + '?postdata=' + postdata, data, {
    headers: {
      "Authorization": authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function getProjectOutletList(token, project_id) {
  var value = (project_id !== undefined && project_id !== null) ? project_id : "";
  return API.get(GET_PROJECT_OUTLET_LIST + '?project_id=' + value, { headers: { "Authorization": token } });
}

export async function getOutletList(token, searchData, limit, sortBy, sortOrder, page, status) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_OUTLET_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue, { headers: { "Authorization": token } });
}

export async function getAllList(token, user_region) {
  var region = (user_region !== undefined && user_region !== null) ? user_region : "";
  return API.get(GET_ALL_OUTLET_LIST + '?user_region=' + region, { headers: { "Authorization": token } });
}



export async function addOutlet(authToken, data) {
  return API.post(ADD_OUTLET, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function editOutlet(authToken, data) {
  return API.post(EDIT_OUTLET, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function editOutletStatus(authToken, data) {
  return API.post(EDIT_OUTLET_STATUS, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function deleteOutlet(authToken, data) {
  return API.post(DELETE_OUTLET, data, { headers: { "Authorization": authToken } });
}

export async function assignOutlet(authToken, data) {
  return API.post(ASSIGN_OUTLET, data, { headers: { "Authorization": authToken } });
}

export async function unassignOutlet(authToken, data) {
  return API.post(UNASSIGN_OUTLET, data, { headers: { "Authorization": authToken } });
}

export async function getCategoryList(token, searchData, limit, sortBy, sortOrder, page, status) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_CATEGORY_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue, { headers: { "Authorization": token } });
}

export async function addCategory(authToken, data) {
  return API.post(ADD_CATEGORY, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function editCategory(authToken, data) {
  return API.post(EDIT_CATEGORY, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function deleteCategory(authToken, data) {
  return API.post(DELETE_CATEGORY, data, { headers: { "Authorization": authToken } });
}

export async function getAllBrandList(token) {
  return API.get(GET_ALL_BRAND_LIST, { headers: { "Authorization": token } });
}

export async function getRoleList(token, searchData, limit, sortBy, sortOrder, page, status) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_ROLE_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue, { headers: { "Authorization": token } });
}

export async function addRole(authToken, data) {
  return API.post(ADD_ROLE, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function editRole(authToken, data) {
  return API.post(EDIT_ROLE, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function deleteRole(authToken, data) {
  return API.post(DELETE_ROLE, data, { headers: { "Authorization": authToken } });
}

export async function getAllRoleList(token) {
  return API.get(GET_ALL_ROLES, { headers: { "Authorization": token } });
}

export async function getRegionList(token, searchData, limit, sortBy, sortOrder, page, status, parent_region) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_REGIONS_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue + "&parent_region=" + parent_region, { headers: { "Authorization": token } });
}

export async function getParentRegionsList(token) {
  return API.get(GET_PARENTREGIONS_LIST, { headers: { "Authorization": token } });
}

export async function addRegion(authToken, data) {
  return API.post(ADD_REGION, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function editRegion(authToken, data) {
  return API.post(EDIT_REGION, data, {
    headers: {
      "Authorization": authToken
    }
  });
}

export async function deleteRegion(authToken, data) {
  return API.post(DELETE_REGION, data, { headers: { "Authorization": authToken } });
}

export async function getAllRegionList(token) {
  return API.get(GET_ALL_REGIONS, { headers: { "Authorization": token } });
}

export async function getBrandList(token, searchData, limit, sortBy, sortOrder, page, status) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_BRAND_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue, { headers: { "Authorization": token } });
}
export async function addBrand(authToken, data) {
  return API.post(ADD_BRAND, data, { headers: { "Authorization": authToken } });
}

export async function editBrand(authToken, data) {
  return API.post(EDIT_BRAND, data, { headers: { "Authorization": authToken } });
}

export async function deleteBrand(authToken, data) {
  return API.post(DELETE_BRAND, data, { headers: { "Authorization": authToken } });
}

export async function getBrandVariant(token, searchData, limit, sortBy, sortOrder, page, status) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_BRAND_VARIANT + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue, { headers: { "Authorization": token } });
}
export async function addBrandVariant(authToken, data) {
  return API.post(ADD_BRAND_VARIANT, data, { headers: { "Authorization": authToken } });
}

export async function updateBrandVariant(authToken, data) {
  return API.post(UPDATE_BRAND_VARIANT, data, { headers: { "Authorization": authToken } });
}

export async function deleteBrandVariant(authToken, data) {
  return API.post(DELETE_BRAND_VARIANT, data, { headers: { "Authorization": authToken } });
}

export async function getProductList(token, searchData, limit, sortBy, sortOrder, page, status, brand_id) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  var brandId = (brand_id !== undefined && brand_id !== null) ? brand_id : "";
  return API.get(GET_PRODUCT_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue + '&brand_id=' + brandId, { headers: { "Authorization": token } });
}

export async function addProductImg(authToken, data, postdata) {
  return API.post(ADD_PRODUCT_IMG + '?postdata=' + postdata, data, {
    headers: {
      "Authorization": authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function addProduct(authToken, data) {
  return API.post(ADD_PRODUCT, data, { headers: { "Authorization": authToken } });
}

export async function editProduct(authToken, data) {
  return API.post(EDIT_PRODUCT, data, { headers: { "Authorization": authToken } });
}

export async function deleteProduct(authToken, data) {
  return API.post(DELETE_PRODUCT, data, { headers: { "Authorization": authToken } });
}

export async function editProductImg(authToken, data, postdata) {
  return API.post(EDIT_PRODUCT_IMG + '?postdata=' + postdata, data, {
    headers: {
      "Authorization": authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function getRedeemList(token, searchData, limit, sortBy, sortOrder, page) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  return API.get(GET_REDEEM_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page, { headers: { "Authorization": token } });
}

export async function getUsersExercises(token, searchData, limit, sortBy, sortOrder, page, startDate, endDate) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sDate = (startDate !== undefined && startDate !== null) ? startDate : "";
  var eDate = (endDate !== undefined && endDate !== null) ? endDate : "";
  return API.get(GET_USER_EXERCISE + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + "&startDate=" + sDate +
    "&endDate=" + eDate, { headers: { "Authorization": token } });
}

export async function getAllExercises(authToken) {
  return API.get(GET_ALL_EXERCISES, { headers: { "Authorization": authToken } });
}

export async function getImported(authToken) {
  return API.get(GET_IMPORTED, { headers: { "Authorization": authToken } });
}

export async function assignToUser(authToken, data) {
  return API.post(ASSIGN_TO_USER, data, { headers: { "Authorization": authToken } });
}

export async function importUserFile(authToken, data) {
  return API.post(IMPORT_USER_FILE, data, {
    headers: {
      "Authorization": authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function getLoginLogs(token, limit, page, userId) {
  return API.get(LOGIN_LOGS + '?limit=' + limit + "&page=" + page + "&user_id=" + userId, { headers: { "Authorization": token } });
}

export async function getVisitationHistory(token, searchData, limit, sortBy, sortOrder, page, status, user_id, project_id,
  outlet_id, rangeV) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  var userId = (user_id !== undefined && user_id !== null) ? user_id : "";
  var projectId = (project_id !== undefined && project_id !== null) ? project_id : "";
  var outletId = (outlet_id !== undefined && outlet_id !== null) ? outlet_id : "";
  var range = (rangeV !== undefined && rangeV !== null) ? rangeV : "";
  return API.get(GET_VISITATION_HISTORY + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&type=' + sValue + '&user_id='
    + userId + '&project_id=' + projectId + '&outlet_id=' + outletId + '&range=' + range, { headers: { "Authorization": token } });
}

export async function outlet_summary_list(token, searchData, limit, sortBy, sortOrder, page, status, user_id, project_id,
  outlet_id, userRole, allowedUser, userRegion) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var projectId = (project_id !== undefined && project_id !== null) ? project_id : "";
  var outletId = (outlet_id !== undefined && outlet_id !== null) ? outlet_id : "";
  var region = (userRegion !== undefined && userRegion !== null) ? userRegion : "";
  return API.get(OUTLET_SUMMARY + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&project_id=' + projectId
    + '&outlet_id=' + outletId + '&user_role=' + userRole + '&allowed_user=' + allowedUser + '&user_region=' + region, { headers: { "Authorization": token } });
}

export async function getTradeList(token, searchData, limit, sortBy, sortOrder, page, status, user_id, project_id) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  var userId = (user_id !== undefined && user_id !== null) ? user_id : "";
  var projectId = (project_id !== undefined && project_id !== null) ? project_id : "";
  return API.get(GET_TRADE_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue + '&user_id='
    + userId + '&project_id=' + projectId, { headers: { "Authorization": token } });
}

export async function getStockDetail(token, searchData, limit, page) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  return API.get(GET_STOCK_DETAIL + '?search=' + searchValue + '&limit=' + limit + "&page=" + page, { headers: { "Authorization": token } });
}

export async function getCSVRequestList(token, limit, sortBy, sortOrder, page, status, report_type, type, start_date, end_date, user_id, user_role, allowed_user) {
  var statusV = (status !== undefined && status !== null) ? status : "";
  var reType = (report_type !== undefined && report_type !== null) ? report_type : "";
  var typeF = (type !== undefined && type !== null) ? type : "";
  var start = (start_date !== undefined && start_date !== null) ? start_date : "";
  var end = (end_date !== undefined && end_date !== null) ? end_date : "";
  return API.get(GET_CSV_REQUEST_LIST + '?limit=' + limit + '&sortBy=' + sortBy +
    '&sortOrder=' + sortOrder + "&page=" + page + "&status=" + statusV + "&type=" + typeF + "&report_type=" + reType +
    "&start_date=" + start + "&end_date=" + end + "&user_id=" + user_id + "&user_role=" + user_role + "&allowed_user=" + allowed_user,
    { headers: { "Authorization": token } });
}

export async function createCSVRequest(token, data) {
  return API.post(CREATE_CSV_REQUEST, data, { headers: { "Authorization": token } });
}

export async function getProductStockList(token, project_id) {
  return API.get(GET_PRODUCT_STOCK_LIST + '?project_id=' + project_id, { headers: { "Authorization": token } });
}

export async function updateStock(token, data) {
  return API.post(UPDATE_STOCK, data, { headers: { "Authorization": token } });
}


export async function getProductStockListByProjects(token, data) {
  return API.post(GET_PROJECT_STOCK_LIST, data, { headers: { "Authorization": token } });
}

export async function deleteCSV(token, data) {
  return API.post(DELETE_CSV, data, { headers: { "Authorization": token } });
}

export async function resubmitRequest(token, data) {
  return API.post(RESUBMIT_CSV_REQUEST, data, { headers: { "Authorization": token } });
}

export async function exportOutlet(token) {
  return API.get(EXPORT_OUTLET, { headers: { "Authorization": token } });
}

export async function importOutlet(token, data) {
  return API.post(IMPORT_OUTLET, data, {
    headers: {
      "Authorization": token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function getRandomAcc(token) {
  return API.get(GET_RANDOM_ACC, { headers: { "Authorization": token } });
}

export async function importScriptStatus(token, data) {
  return API.post(IMPORT_SCRIPT_STATUS, data, { headers: { "Authorization": token } });
}

export async function getQuestionnairesList(token, searchData, limit, sortBy, sortOrder, page, status) {
  var searchValue = (searchData !== undefined && searchData !== null) ? searchData : "";
  var sValue = (status !== undefined && status !== null) ? status : "";
  return API.get(GET_QUESTIONNAIRES_LIST + '?search=' + searchValue + '&limit=' + limit +
    '&sortBy=' + sortBy + '&sortOrder=' + sortOrder + "&page=" + page + '&status=' + sValue, { headers: { "Authorization": token } });
}
export async function addQuestionnaires(authToken, data) {
  return API.post(ADD_QUESTIONNAIRES, data, { headers: { "Authorization": authToken } });
}

export async function editQuestionnaires(authToken, data) {
  return API.post(EDIT_QUESTIONNAIRES, data, { headers: { "Authorization": authToken } });
}

export async function deleteQuestionnaires(authToken, data) {
  return API.post(DELETE_QUESTIONNAIRES, data, { headers: { "Authorization": authToken } });
}