// GraphQLリゾルバー実装
export const resolvers = {
  Query: {
    // ユーザー関連
    me: async (_: any, __: any, { supabase, user }: any) => {
      if (!user) return null
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) throw new Error(error.message)
      
      // データベースのsnake_caseをGraphQLのcamelCaseに変換
      if (data) {
        return {
          ...data,
          avatarUrl: data.avatar_url || null,
          createdAt: data.created_at || null,
          updatedAt: data.updated_at || null
        }
      }
      return data
    },

    users: async (_: any, __: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      
      // データベースのsnake_caseをGraphQLのcamelCaseに変換
      return data?.map((user: any) => ({
        ...user,
        avatarUrl: user.avatar_url || null,
        createdAt: user.created_at || null,
        updatedAt: user.updated_at || null
      })) || []
    },

    user: async (_: any, { id }: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      
      // データベースのsnake_caseをGraphQLのcamelCaseに変換
      if (data) {
        return {
          ...data,
          avatarUrl: data.avatar_url || null,
          createdAt: data.created_at || null,
          updatedAt: data.updated_at || null
        }
      }
      return data
    },

    // イベント関連
    events: async (_: any, __: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
      
      if (error) throw new Error(error.message)
      return data
    },

    event: async (_: any, { id }: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    upcomingEvents: async (_: any, __: any, { supabase }: any) => {
      const now = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', now)
        .order('date', { ascending: true })
        .limit(10)
      
      if (error) throw new Error(error.message)
      return data
    },

    // 出席関連
    attendances: async (_: any, { eventId }: any, { supabase }: any) => {
      let query = supabase.from('attendances').select('*')
      
      if (eventId) {
        query = query.eq('event_id', eventId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data
    },

    myAttendances: async (_: any, __: any, { supabase, user }: any) => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('attendances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data
    },

    // 練習記録関連
    practiceRecords: async (_: any, { eventId, userId }: any, { supabase }: any) => {
      let query = supabase.from('practice_records').select('*')
      
      if (eventId) query = query.eq('event_id', eventId)
      if (userId) query = query.eq('user_id', userId)
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data
    },

    myPracticeRecords: async (_: any, __: any, { supabase, user }: any) => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('practice_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data
    },
  },

  Mutation: {
    // ユーザー関連
    updateProfile: async (_: any, { input }: any, { supabase, user }: any) => {
      if (!user) throw new Error('認証が必要です')
      
      const { data, error } = await supabase
        .from('users')
        .update(input)
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    // イベント関連
    createEvent: async (_: any, { input }: any, { supabase, user }: any) => {
      if (!user) throw new Error('認証が必要です')
      
      const { data, error } = await supabase
        .from('events')
        .insert({ ...input, created_by: user.id })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    updateEvent: async (_: any, { id, input }: any, { supabase, user }: any) => {
      if (!user) throw new Error('認証が必要です')
      
      const { data, error } = await supabase
        .from('events')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    deleteEvent: async (_: any, { id }: any, { supabase, user }: any) => {
      if (!user) throw new Error('認証が必要です')
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      
      if (error) throw new Error(error.message)
      return true
    },

    // 出席関連
    updateAttendance: async (_: any, { input }: any, { supabase, user }: any) => {
      if (!user) throw new Error('認証が必要です')
      
      const { data, error } = await supabase
        .from('attendances')
        .upsert(input)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    // 練習記録関連
    createPracticeRecord: async (_: any, { input }: any, { supabase, user }: any) => {
      if (!user) throw new Error('認証が必要です')
      
      const { data, error } = await supabase
        .from('practice_records')
        .insert(input)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    updatePracticeRecord: async (_: any, { id, input }: any, { supabase, user }: any) => {
      if (!user) throw new Error('認証が必要です')
      
      const { data, error } = await supabase
        .from('practice_records')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    deletePracticeRecord: async (_: any, { id }: any, { supabase, user }: any) => {
      if (!user) throw new Error('認証が必要です')
      
      const { error } = await supabase
        .from('practice_records')
        .delete()
        .eq('id', id)
      
      if (error) throw new Error(error.message)
      return true
    },
  },

  // リレーション解決は不要（Profileが直接usersテーブル）

  // リレーション解決は一旦削除してシンプルに
}
