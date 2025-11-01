function checkAuth(): boolean {
    return document.cookie.split("; ").some(c => c.startsWith("token="));
}

export const isAuthenticated = checkAuth();
