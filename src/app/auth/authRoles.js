/**
 * Authorization Roles
 */
const authRoles = {
  //admin: ['admin', 'superadmin'],
  //staff: ['admin', 'staff'],
 // user: ['admin', 'staff', 'user'],
  //onlyGuest: [],
  estadistica : [ 'appsf', 'dashboards','logout','divider-1'],
  contenido : ['appsc','sliders', 'notifications', 'redentions', 'News', 'misions', 'bonus','imperdibles', 'tricampeons', 'bingos-image','logout','divider-1'],
  datos:['appsf','uploads','dashboards', 'logout', 'divider-1'],
  usuario:[ 'appsf','clientsMetrics', 'competenciaReports', 'prizes', 'points','stocks','logout', 'divider-1'],
  carga_datos:['appsf', 'uploads','logout','divider-1']
};

export default authRoles;
