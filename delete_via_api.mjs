

const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTg4MTM5NzM1OSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc4Nzg0NjA0OSwiaWF0IjoxNzg3ODI0NDQ5fQ.m2bnSUTLwnONg-LsximknPLWAAZpXvZF9lysQHHLqKA";
const REST_AUTH_KEY = "a3ee69578c7d18235bf758f0c5db3fea0094b1e10b35679688611633c6c761a7-35bfd7ba356ecfea";

async function deleteFile() {
    try {
        const url = "https://srv2124-files.hstgr.io/rest/35bfd7ba356ecfea/api/resources/public_html/public/run_artisan.php";
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'X-Auth': AUTH_KEY,
                'X-Auth-Rest': REST_AUTH_KEY,
            }
        });
        console.log("Delete status:", res.status);
        console.log("Response:", await res.text());
    } catch (e) {
        console.error(e);
    }
}
deleteFile();
