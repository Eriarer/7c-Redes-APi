export const appConfig = {
  port: process.env.PORT || 3000,
  // dbDirectory: '/mnt/nfs_cloud/'
  dbDirectory: 'temp/',
  email: process.env.EMAIL,
  emailPass: process.env.PASS
}
