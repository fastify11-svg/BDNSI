async function testRoutes() {
    console.log("Fetching login page to get CSRF token...");
    const loginPageRes = await fetch("https://nenobet.live/admin/login");
    const loginHtml = await loginPageRes.text();
    const csrfMatch = loginHtml.match(/name="csrf-token" content="([^"]+)"/);
    if (!csrfMatch) {
        console.error("Could not find CSRF token");
        return;
    }
    const csrfToken = csrfMatch[1];
    
    // Get cookies
    let cookies = loginPageRes.headers.raw ? loginPageRes.headers.raw()['set-cookie'] || [] : loginPageRes.headers.getSetCookie();
    cookies = cookies.map(c => c.split(';')[0]).join('; ');
    
    console.log("Attempting login as admin@gmail.com...");
    const loginPayload = new URLSearchParams();
    loginPayload.append('_token', csrfToken);
    loginPayload.append('email', 'fastify11@gmail.com');
    loginPayload.append('password', '12345678');

    const authRes = await fetch("https://nenobet.live/admin/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookies,
            'Referer': 'https://nenobet.live/admin/login'
        },
        body: loginPayload.toString(),
        redirect: 'manual'
    });
    
    console.log("Login redirect Status:", authRes.status);
    
    let authCookiesRaw = authRes.headers.raw ? authRes.headers.raw()['set-cookie'] || [] : authRes.headers.getSetCookie();
    if (authCookiesRaw.length > 0) {
        cookies = authCookiesRaw.map(c => c.split(';')[0]).join('; ');
    }
    
    console.log("Fetching Center Risk Dashboard via standard request...");
    const dashboardRes = await fetch("https://nenobet.live/admin/center-risk", {
        headers: {
            'Cookie': cookies
        },
        redirect: 'manual'
    });
    console.log("Center Risk Status:", dashboardRes.status);

    if (dashboardRes.status === 200) {
        const html = await dashboardRes.text();
        const match = html.match(/data-page="([^"]+)"/);
        if (match) {
            const dashboardJson = JSON.parse(match[1].replace(/&quot;/g, '"'));
            console.log("Inertia Component:", dashboardJson.component);
            console.log("Props keys:", Object.keys(dashboardJson.props));
            
            if (dashboardJson.props.centers) {
                console.log("SUCCESS: centers prop found!");
                console.log(`Found ${dashboardJson.props.centers.length} centers in data.`);
            } else {
                console.log("ERROR: centers prop missing!");
            }
        } else {
            console.log("ERROR: data-page attribute not found in HTML!");
        }
    } else {
        console.log("Request failed or redirected");
    }
}

testRoutes().catch(console.error);
