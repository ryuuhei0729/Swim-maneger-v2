(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/supabase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClientComponentClient": ()=>createClientComponentClient
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://otzdsnsdmgoxmxendfln.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90emRzbnNkbWdveG14ZW5kZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTcxODUsImV4cCI6MjA3MDM5MzE4NX0.y5ezczM3l1SWlF7Qi-1vVmKMLyMPaOqBPwBjwosE2Lc");
const createClientComponentClient = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // windowオブジェクトでクライアントを管理してHot Reloadに対応
    if (!window.__supabase_client__) {
        window.__supabase_client__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseAnonKey, {
            auth: {
                storageKey: 'swim-manager-auth',
                storage: window.localStorage,
                detectSessionInUrl: false,
                autoRefreshToken: true,
                persistSession: true
            },
            // リアルタイム機能を無効にしてパフォーマンス向上
            realtime: {
                params: {
                    eventsPerSecond: 10
                }
            }
        });
    }
    return window.__supabase_client__;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/providers/AuthProvider.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": ()=>AuthProvider,
    "useAuth": ()=>useAuth
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// Hot Reload対応のSupabaseクライアント（グローバルスコープで管理）
const getSupabaseClient = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClientComponentClient"])();
const AuthProvider = (param)=>{
    let { children } = param;
    _s();
    const [authState, setAuthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        user: null,
        profile: null,
        loading: true
    });
    // タイムアウト用のref
    const loadingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
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
            var _user_user_metadata;
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            const newProfile = {
                id: userId,
                email: user.email || '',
                name: ((_user_user_metadata = user.user_metadata) === null || _user_user_metadata === void 0 ? void 0 : _user_user_metadata.name) || '',
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
                redirectTo: "".concat(window.location.origin, "/reset-password")
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // 同一のSupabaseクライアントインスタンスを使用
            const supabase = getSupabaseClient();
            // ローディングタイムアウトを設定（5秒）
            loadingTimeoutRef.current = setTimeout({
                "AuthProvider.useEffect": ()=>{
                    setAuthState({
                        "AuthProvider.useEffect": (prev)=>({
                                ...prev,
                                loading: false
                            })
                    }["AuthProvider.useEffect"]);
                }
            }["AuthProvider.useEffect"], 5000);
            // 初期セッション取得
            const getInitialSession = {
                "AuthProvider.useEffect.getInitialSession": async ()=>{
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
                        if (session === null || session === void 0 ? void 0 : session.user) {
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
                }
            }["AuthProvider.useEffect.getInitialSession"];
            getInitialSession();
            // 認証状態の変更を監視（同じクライアントインスタンスを使用）
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "AuthProvider.useEffect": async (event, session)=>{
                    try {
                        if (session === null || session === void 0 ? void 0 : session.user) {
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
                        setAuthState({
                            "AuthProvider.useEffect": (prev)=>({
                                    ...prev,
                                    loading: false
                                })
                        }["AuthProvider.useEffect"]);
                    }
                }
            }["AuthProvider.useEffect"]);
            return ({
                "AuthProvider.useEffect": ()=>{
                    subscription.unsubscribe();
                    // タイムアウトをクリア
                    if (loadingTimeoutRef.current) {
                        clearTimeout(loadingTimeoutRef.current);
                        loadingTimeoutRef.current = null;
                    }
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/providers/AuthProvider.tsx",
        lineNumber: 346,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "MMaOrN3Y8dM2WW+yKw2op4QUIME=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_f6f93cd4._.js.map