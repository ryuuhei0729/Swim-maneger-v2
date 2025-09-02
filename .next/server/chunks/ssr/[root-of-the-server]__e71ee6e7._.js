module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[project]/src/lib/supabase.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "createClientComponentClient": ()=>createClientComponentClient
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://otzdsnsdmgoxmxendfln.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90emRzbnNkbWdveG14ZW5kZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTcxODUsImV4cCI6MjA3MDM5MzE4NX0.y5ezczM3l1SWlF7Qi-1vVmKMLyMPaOqBPwBjwosE2Lc");
const createClientComponentClient = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        // サーバーサイドでは新しいインスタンスを返す
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseAnonKey);
    }
    //TURBOPACK unreachable
    ;
};
}),
"[project]/src/components/providers/AuthProvider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "AuthProvider": ()=>AuthProvider,
    "useAuth": ()=>useAuth
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Hot Reload対応のSupabaseクライアント（グローバルスコープで管理）
const getSupabaseClient = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClientComponentClient"])();
const AuthProvider = ({ children })=>{
    const [authState, setAuthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        user: null,
        profile: null,
        loading: true
    });
    // タイムアウト用のref
    const loadingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ユーザープロフィールを取得
    const fetchUserProfile = async (userId)=>{
        try {
            const supabase = getSupabaseClient();
            // タイムアウト付きでプロフィールを取得
            const profilePromise = supabase.from('users').select('*').eq('id', userId).single();
            const timeoutPromise = new Promise((_, reject)=>{
                setTimeout(()=>reject(new Error('Profile fetch timeout')), 5000); // 5秒タイムアウト
            });
            const { data, error } = await Promise.race([
                profilePromise,
                timeoutPromise
            ]);
            if (error) {
                // プロフィールが存在しない場合は作成を試行（タイムアウトの場合は除く）
                if (error.code === 'PGRST116' && error.message !== 'Profile fetch timeout') {
                    return await createUserProfile(userId);
                }
                return null;
            }
            return data;
        } catch (error) {
            return null;
        }
    };
    // プロフィールを非同期で更新（UIをブロックしない）
    const updateProfileAsync = async (userId)=>{
        try {
            const profile = await fetchUserProfile(userId);
            setAuthState((prev)=>({
                    ...prev,
                    profile
                }));
        } catch (error) {
            console.error('[Auth] Failed to update profile async:', error);
        }
    };
    // ユーザープロフィールを作成
    const createUserProfile = async (userId)=>{
        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            const newProfile = {
                id: userId,
                email: user.email || '',
                name: user.user_metadata?.name || '',
                avatar_url: null,
                role: 'player',
                generation: null,
                birthday: null,
                bio: null,
                gender: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            const { data, error } = await supabase.from('users').insert(newProfile).select().single();
            if (error) {
                return null;
            }
            return data;
        } catch (error) {
            return null;
        }
    };
    // ログイン
    const signIn = async (email, password)=>{
        try {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return {
                data,
                error: null
            };
        } catch (error) {
            return {
                data: null,
                error
            };
        }
    };
    // サインアップ
    const signUp = async (email, password, name)=>{
        try {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name || ''
                    }
                }
            });
            if (error) throw error;
            // サインアップ成功時にプロフィールも作成
            if (data.user) {
                await createUserProfile(data.user.id);
            }
            return {
                data,
                error: null
            };
        } catch (error) {
            return {
                data: null,
                error
            };
        }
    };
    // ログアウト
    const signOut = async ()=>{
        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setAuthState({
                user: null,
                profile: null,
                loading: false
            });
            return {
                error: null
            };
        } catch (error) {
            return {
                error
            };
        }
    };
    // パスワードリセット
    const resetPassword = async (email)=>{
        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });
            if (error) throw error;
            return {
                error: null
            };
        } catch (error) {
            return {
                error
            };
        }
    };
    // パスワード更新
    const updatePassword = async (newPassword)=>{
        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
            return {
                error: null
            };
        } catch (error) {
            return {
                error
            };
        }
    };
    // プロフィール更新
    const updateProfile = async (updates)=>{
        try {
            if (!authState.user) throw new Error('User not authenticated');
            const supabase = getSupabaseClient();
            const { error } = await supabase.from('users').update({
                ...updates,
                updated_at: new Date().toISOString()
            }).eq('id', authState.user.id);
            if (error) throw error;
            // プロフィールを再取得
            const updatedProfile = await fetchUserProfile(authState.user.id);
            if (updatedProfile) {
                setAuthState((prev)=>({
                        ...prev,
                        profile: updatedProfile
                    }));
            }
            return {
                error: null
            };
        } catch (error) {
            return {
                error
            };
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // 同一のSupabaseクライアントインスタンスを使用
        const supabase = getSupabaseClient();
        // ローディングタイムアウトを設定（5秒）
        loadingTimeoutRef.current = setTimeout(()=>{
            setAuthState((prev)=>({
                    ...prev,
                    loading: false
                }));
        }, 5000);
        // 初期セッション取得
        const getInitialSession = async ()=>{
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    setAuthState({
                        user: null,
                        profile: null,
                        loading: false
                    });
                    return;
                }
                if (session?.user) {
                    setAuthState({
                        user: session.user,
                        profile: null,
                        loading: false
                    });
                    // プロフィールを非同期で取得（UIをブロックしない）
                    updateProfileAsync(session.user.id);
                } else {
                    setAuthState({
                        user: null,
                        profile: null,
                        loading: false
                    });
                }
            } catch (error) {
                setAuthState({
                    user: null,
                    profile: null,
                    loading: false
                });
            } finally{
                // タイムアウトをクリア
                if (loadingTimeoutRef.current) {
                    clearTimeout(loadingTimeoutRef.current);
                    loadingTimeoutRef.current = null;
                }
            }
        };
        getInitialSession();
        // 認証状態の変更を監視（同じクライアントインスタンスを使用）
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session)=>{
            try {
                if (session?.user) {
                    setAuthState({
                        user: session.user,
                        profile: null,
                        loading: false
                    });
                    // プロフィールを非同期で取得
                    updateProfileAsync(session.user.id);
                } else {
                    setAuthState({
                        user: null,
                        profile: null,
                        loading: false
                    });
                }
            } catch (error) {
                setAuthState((prev)=>({
                        ...prev,
                        loading: false
                    }));
            }
        });
        return ()=>{
            subscription.unsubscribe();
            // タイムアウトをクリア
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
            }
        };
    }, []);
    const value = {
        ...authState,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        isAuthenticated: !!authState.user,
        isLoading: authState.loading
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/providers/AuthProvider.tsx",
        lineNumber: 346,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__e71ee6e7._.js.map