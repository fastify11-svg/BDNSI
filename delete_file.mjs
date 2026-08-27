import * as ftp from 'basic-ftp';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.staging' });

async function deleteFile() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USERNAME,
            password: process.env.FTP_PASSWORD,
            secure: false
        });
        await client.remove("public_html/public/get_users.php");
        console.log("Deleted get_users.php");
    } catch(err) {
        console.log(err)
    }
    client.close()
}
deleteFile()
