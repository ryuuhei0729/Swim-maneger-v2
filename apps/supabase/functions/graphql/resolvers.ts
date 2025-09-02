// GraphQLリゾルバー実装
export const resolvers = {
  Query: {
    // ユーザー関連
    me: async (_: any, __: any, { supabase, user }: any) => {
      if (!user) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    users: async (_: any, __: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data
    },

    user: async (_: any, { id }: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    // イベント関連
    events: async (_: any, __: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true })
      
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
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', now)
        .order('start_time', { ascending: true })
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
        .from('profiles')
        .update(input)
        .eq('user_id', user.id)
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

  // リレーション解決
  Profile: {
    user: async (parent: any, _: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', parent.user_id)
        .single()
      
      if (error) return null
      return data
    },
  },

  Event: {
    creator: async (parent: any, _: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', parent.created_by)
        .single()
      
      if (error) return null
      return data
    },

    attendances: async (parent: any, _: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('attendances')
        .select('*')
        .eq('event_id', parent.id)
      
      if (error) return []
      return data
    },

    practiceRecords: async (parent: any, _: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('practice_records')
        .select('*')
        .eq('event_id', parent.id)
      
      if (error) return []
      return data
    },
  },

  Attendance: {
    event: async (parent: any, _: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', parent.event_id)
        .single()
      
      if (error) return null
      return data
    },

    user: async (parent: any, _: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', parent.user_id)
        .single()
      
      if (error) return null
      return data
    },
  },

  PracticeRecord: {
    event: async (parent: any, _: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', parent.event_id)
        .single()
      
      if (error) return null
      return data
    },

    user: async (parent: any, _: any, { supabase }: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', parent.user_id)
        .single()
      
      if (error) return null
      return data
    },
  },
}
