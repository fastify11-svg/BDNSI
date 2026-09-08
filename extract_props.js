const fs = require('fs');
const html = fs.readFileSync('admin_commissions_debug.html', 'utf8');
const match = html.match(/data-page="([^"]+)"/);
if (match) {
    const data = JSON.parse(match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
    fs.writeFileSync('admin_props.json', JSON.stringify(data, null, 2));
    console.log("Extracted successfully.");
} else {
    console.log("No data-page attribute found in HTML.");
}
