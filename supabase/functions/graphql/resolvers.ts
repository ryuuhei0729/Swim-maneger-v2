// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Deno型定義
declare const Deno: any

// Supabaseクライアントを作成（環境変数から取得）
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

console.log('Supabase URL:', supabaseUrl)
console.log('Service Key exists:', !!supabaseServiceKey)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ユーザーIDを取得するヘルパー関数
function getUserId(context: any): string {
  const userId = context?.user?.id
  if (!userId) {
    throw new Error('認証が必要です')
  }
  return userId
}

// 日付フォーマットヘルパー関数
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export const resolvers = {
  // クエリリゾルバー
  Query: {
    // ユーザー関連
    me: async (_: any, __: any, context: any) => {
      const userId = getUserId(context)
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (error) {
          throw new Error(error.message)
        }
        
        if (!data) {
          return null
        }
        
        // データベースのフィールド名をGraphQLスキーマに合わせて変換
        return {
          id: data.id,
          userId: data.id,
          name: data.name,
          gender: data.gender,
          profileImagePath: data.profile_image_path,
          birthday: data.birthday,
          bio: data.bio,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      } catch (err) {
        throw err
      }
    },

    // 種目・泳法関連
    styles: async () => {
      try {
        const { data, error } = await supabase
          .from('styles')
          .select('id, name_jp, name, distance, style')
          .order('id')
        
        if (error) {
          console.error('Styles query error:', error)
          throw new Error(error.message)
        }
        
        if (!data) {
          return []
        }
        
        // データベースのフィールド名をGraphQLスキーマに合わせて変換
        const strokeMapping: { [key: string]: string } = {
          'fr': 'FREESTYLE',
          'br': 'BREASTSTROKE', 
          'ba': 'BACKSTROKE',
          'fly': 'BUTTERFLY',
          'im': 'INDIVIDUAL_MEDLEY'
        }
        
        const transformedData = data.map((style: any) => ({
          id: style.id,
          nameJp: style.name_jp,
          name: style.name,
          distance: style.distance,
          stroke: strokeMapping[style.style] || 'FREESTYLE'
        }))
        
        return transformedData
      } catch (err) {
        console.error('Styles resolver error:', err)
        throw err
      }
    },

    style: async (_: any, { id }: { id: string }) => {
      const { data, error } = await supabase
        .from('styles')
        .select('id, name_jp, name, distance, style')
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      
      // データベースのフィールド名をGraphQLスキーマに合わせて変換
      const strokeMapping: { [key: string]: string } = {
        'fr': 'FREESTYLE',
        'br': 'BREASTSTROKE', 
        'ba': 'BACKSTROKE',
        'fly': 'BUTTERFLY',
        'im': 'INDIVIDUAL_MEDLEY'
      }
      
      return {
        id: data.id,
        nameJp: data.name_jp,
        name: data.name,
        distance: data.distance,
        stroke: strokeMapping[data.style] || 'FREESTYLE'
      }
    },

    // 練習タグ関連
    myPracticeTags: async (_: any, __: any, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_tags')
        .select('*')
        .eq('user_id', userId)
        .order('created_at')
      
      if (error) throw new Error(error.message)
      return data || []
    },

    practiceTag: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_tags')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    // 練習記録関連
    myPracticeLogs: async (_: any, { startDate, endDate }: { startDate?: string, endDate?: string }, context: any) => {
      const userId = getUserId(context)
      
      let query = supabase
        .from('practice_logs')
        .select(`
          *,
          practice_times(*)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })
      
      if (startDate) {
        query = query.gte('date', startDate)
      }
      if (endDate) {
        query = query.lte('date', endDate)
      }
      
      const { data, error } = await query
      
      if (error) throw new Error(error.message)
      
      // タグの構造を変換し、GraphQLスキーマに合わせてフィールド名を変換
      const transformedData = data?.map(log => ({
        id: log.id,
        userId: log.user_id || userId, // フォールバック
        date: log.date,
        place: log.place,
        style: log.style,
        repCount: log.rep_count,
        setCount: log.set_count,
        distance: log.distance,
        circle: log.circle,
        note: log.note,
        times: (log.practice_times || []).map((time: any) => ({
          id: time.id,
          userId: time.user_id || userId, // フォールバック
          practiceLogId: time.practice_log_id,
          repNumber: time.rep_number,
          setNumber: time.set_number,
          time: time.time,
          createdAt: time.created_at,
          updatedAt: time.updated_at
        })),
        createdAt: log.created_at,
        updatedAt: log.updated_at
      })) || []
      
      return transformedData
    },

    practiceLog: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_logs')
        .select(`
          *,
          practice_times(*),
          practice_log_tags(
            practice_tag_id,
            practice_tags(*)
          )
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw new Error(error.message)
      
      // タグの構造を変換し、GraphQLスキーマに合わせてフィールド名を変換
      const transformedData = {
        id: data.id,
        userId: data.user_id,
        date: data.date,
        place: data.place,
        style: data.style,
        repCount: data.rep_count,
        setCount: data.set_count,
        distance: data.distance,
        circle: data.circle,
        note: data.note,
        tags: data.practice_log_tags?.map((relation: any) => relation.practice_tags) || [],
        times: (data.practice_times || []).map((time: any) => ({
          id: time.id,
          userId: time.user_id || userId,
          practiceLogId: time.practice_log_id,
          repNumber: time.rep_number,
          setNumber: time.set_number,
          time: time.time,
          createdAt: time.created_at,
          updatedAt: time.updated_at
        })),
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      return transformedData
    },

    practiceLogsByDate: async (_: any, { date }: { date: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_logs')
        .select(`
          *,
          practice_times(*),
          practice_log_tags(
            practice_tag_id,
            practice_tags(*)
          )
        `)
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at')
      
      if (error) throw new Error(error.message)
      
      // タグの構造を変換し、GraphQLスキーマに合わせてフィールド名を変換
      const transformedData = data?.map(log => ({
        id: log.id,
        userId: log.user_id || userId, // フォールバック
        date: log.date,
        place: log.place,
        style: log.style,
        repCount: log.rep_count,
        setCount: log.set_count,
        distance: log.distance,
        circle: log.circle,
        note: log.note,
        times: log.practice_times || [],
        createdAt: log.created_at,
        updatedAt: log.updated_at
      })) || []
      
      return transformedData
    },

    // 大会関連
    myCompetitions: async (_: any, __: any, context: any) => {
      const { data, error } = await supabase
        .from('competitions')
        .select(`
          *,
          records(*)
        `)
        .order('date', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data || []
    },

    competition: async (_: any, { id }: { id: string }, context: any) => {
      const { data, error } = await supabase
        .from('competitions')
        .select(`
          *,
          records(*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    // 記録関連
    myRecords: async (_: any, { startDate, endDate, styleId, poolType }: {
      startDate?: string,
      endDate?: string,
      styleId?: number,
      poolType?: number
    }, context: any) => {
      const userId = getUserId(context)
      
      let query = supabase
        .from('records')
        .select(`
          *,
          styles(*),
          competitions(*),
          split_times(*)
        `)
        .eq('user_id', userId)
        .order('id', { ascending: false })
      
      // 基本的なrecordsテーブルの構造に合わせる（remote_migration.sqlの構造）
      if (styleId) {
        query = query.eq('style_id', styleId)
      }
      
      const { data, error } = await query
      
      if (error) throw new Error(error.message)
      
      // GraphQLスキーマに合わせてフィールド名を変換
      const transformedData = data?.map(record => ({
        id: record.id,
        userId: record.user_id,
        competitionId: record.competition_id,
        styleId: record.style_id,
        time: record.time,
        videoUrl: record.video_url,
        note: record.note,
        competition: record.competitions ? {
          id: record.competitions.id,
          title: record.competitions.title,
          date: record.competitions.date
        } : null,
        style: record.styles ? {
          id: record.styles.id,
          nameJp: record.styles.name_jp,
          name: record.styles.name,
          stroke: {
            'fr': 'FREESTYLE',
            'br': 'BREASTSTROKE', 
            'ba': 'BACKSTROKE',
            'fly': 'BUTTERFLY',
            'im': 'INDIVIDUAL_MEDLEY'
          }[record.styles.style] || 'FREESTYLE',
          distance: record.styles.distance
        } : null,
        splitTimes: record.split_times?.map((split: any) => ({
          id: split.id,
          recordId: split.record_id,
          distance: split.distance,
          splitTime: split.split_time
        })) || []
      })) || []
      
      return transformedData
    },

    record: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('records')
        .select(`
          *,
          styles(*),
          competitions(*),
          split_times(*)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw new Error(error.message)
      
      // snake_caseからcamelCaseにマッピング
      return {
        id: data.id,
        userId: data.user_id,
        competitionId: data.competition_id,
        styleId: data.style_id,
        time: data.time,
        videoUrl: data.video_url,
        note: data.note,
        competition: data.competitions ? {
          id: data.competitions.id,
          title: data.competitions.title,
          date: data.competitions.date,
          place: data.competitions.place,
          poolType: data.competitions.pool_type
        } : null,
        style: data.styles ? {
          id: data.styles.id,
          nameJp: data.styles.name_jp,
          name: data.styles.name,
          stroke: {
            'fr': 'FREESTYLE',
            'br': 'BREASTSTROKE', 
            'ba': 'BACKSTROKE',
            'fly': 'BUTTERFLY',
            'im': 'INDIVIDUAL_MEDLEY'
          }[data.styles.style] || 'FREESTYLE',
          distance: data.styles.distance
        } : null,
        splitTimes: data.split_times?.map((split: any) => ({
          id: split.id,
          recordId: split.record_id,
          distance: split.distance,
          splitTime: split.split_time
        })) || []
      }
    },

    recordsByDate: async (_: any, { date }: { date: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('records')
        .select(`
          *,
          styles(*),
          competitions(*),
          split_times(*)
        `)
        .eq('user_id', userId)
        .order('id')
      
      if (error) throw new Error(error.message)
      
      // GraphQLスキーマに合わせてフィールド名を変換
      const transformedData = data?.map(record => ({
        id: record.id,
        userId: record.user_id,
        competitionId: record.competition_id,
        styleId: record.style_id,
        time: record.time,
        videoUrl: record.video_url,
        note: record.note,
        competition: record.competitions ? {
          id: record.competitions.id,
          title: record.competitions.title,
          date: record.competitions.date
        } : null,
        style: record.styles ? {
          id: record.styles.id,
          nameJp: record.styles.name_jp,
          name: record.styles.name,
          stroke: {
            'fr': 'FREESTYLE',
            'br': 'BREASTSTROKE', 
            'ba': 'BACKSTROKE',
            'fly': 'BUTTERFLY',
            'im': 'INDIVIDUAL_MEDLEY'
          }[record.styles.style] || 'FREESTYLE',
          distance: record.styles.distance
        } : null,
        splitTimes: record.split_times?.map((split: any) => ({
          id: split.id,
          recordId: split.record_id,
          distance: split.distance,
          splitTime: split.split_time
        })) || []
      })) || []
      
      return transformedData
    },

    // ベストタイム関連
    myBestTimes: async (_: any, { poolType }: { poolType?: number }, context: any) => {
      const userId = getUserId(context)
      
      let query = supabase
        .from('best_times')
        .select(`
          *,
          styles(*),
          records(*)
        `)
        .eq('user_id', userId)
        .order('best_time')
      
      if (poolType !== undefined) {
        query = query.eq('pool_type', poolType)
      }
      
      const { data, error } = await query
      
      if (error) throw new Error(error.message)
      return data || []
    },

    bestTime: async (_: any, { styleId, poolType }: { styleId: string, poolType: number }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('best_times')
        .select(`
          *,
          styles(*),
          records(*)
        `)
        .eq('user_id', userId)
        .eq('style_id', styleId)
        .eq('pool_type', poolType)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    // 個人目標関連
    myPersonalGoals: async (_: any, __: any, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('personal_goals')
        .select(`
          *,
          styles(*),
          goal_progress(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data || []
    },

    personalGoal: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('personal_goals')
        .select(`
          *,
          styles(*),
          goal_progress(*)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    // カレンダー関連
    calendarData: async (_: any, { year, month }: { year: number, month: number }, context: any) => {
      const userId = getUserId(context)
      
      // 月の開始日と終了日を計算
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      const startDateStr = formatDate(startDate)
      const endDateStr = formatDate(endDate)
      
      // 練習記録を取得
      const { data: practiceLogs, error: practiceError } = await supabase
        .from('practice_logs')
        .select('date')
        .eq('user_id', userId)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
      
      if (practiceError) throw new Error(practiceError.message)
      
      // 記録を取得（基本的なrecordsテーブル構造に合わせる）
      const { data: records, error: recordsError } = await supabase
        .from('records')
        .select('id')
        .eq('user_id', userId)
      
      if (recordsError) throw new Error(recordsError.message)
      
      // 日付別のデータを集計
      const practicesByDate = new Map<string, number>()
      const recordsByDate = new Map<string, number>()
      
      practiceLogs?.forEach(log => {
        const date = log.date
        practicesByDate.set(date, (practicesByDate.get(date) || 0) + 1)
      })
      
      // 記録は基本構造では日付フィールドがないため、作成日で代用
      records?.forEach(record => {
        // 実際の実装では、競技会の日付を使用する場合は別途取得が必要
        recordsByDate.set(startDateStr, (recordsByDate.get(startDateStr) || 0) + 1)
      })
      
      // カレンダーデータを生成
      const days: Array<{
        date: string
        hasPractice: boolean
        hasCompetition: boolean
        practiceCount: number
        recordCount: number
      }> = []
      const daysInMonth = endDate.getDate()
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = formatDate(new Date(year, month - 1, day))
        const practiceCount = practicesByDate.get(date) || 0
        const recordCount = recordsByDate.get(date) || 0
        
        days.push({
          date,
          hasPractice: practiceCount > 0,
          hasCompetition: recordCount > 0,
          practiceCount,
          recordCount
        })
      }
      
      return {
        year,
        month,
        days,
        summary: {
          totalPractices: practiceLogs?.length || 0,
          totalCompetitions: records?.length || 0,
          totalRecords: records?.length || 0
        }
      }
    }
  },

  // ミューテーションリゾルバー
  Mutation: {
    // 練習タグ関連
    createPracticeTag: async (_: any, { input }: { input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_tags')
        .insert({
          user_id: userId,
          name: input.name,
          color: input.color || '#3B82F6'
        })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    updatePracticeTag: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_tags')
        .update(input)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    deletePracticeTag: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { error } = await supabase
        .from('practice_tags')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw new Error(error.message)
      return true
    },

    // 練習記録関連
    createPracticeLog: async (_: any, { input }: { input: any }, context: any) => {
      try {
        const userId = getUserId(context)
        
        // 練習記録を作成
        const insertData = {
          user_id: userId,
          date: input.date || input.practiceDate,
          place: input.place || input.location,
          style: input.style,
          rep_count: input.repCount,
          set_count: input.setCount,
          distance: input.distance,
          circle: input.circle,
          note: input.note
        }
        
        const { data: practiceLog, error: practiceLogError } = await supabase
          .from('practice_logs')
          .insert(insertData)
          .select(`
            *,
            practice_times(*)
          `)
          .single()
        
        if (practiceLogError) {
          throw new Error(practiceLogError.message)
        }
        
        if (!practiceLog) {
          throw new Error('Failed to create practice log: returned null')
        }
 
        
        // 基本データをGraphQLスキーマに合わせて変換して返す
        const transformedLog = {
          id: practiceLog.id,
          userId: practiceLog.user_id || userId, // フォールバック
          date: practiceLog.date,
          place: practiceLog.place,
          style: practiceLog.style,
          repCount: practiceLog.rep_count,
          setCount: practiceLog.set_count,
          distance: practiceLog.distance,
          circle: practiceLog.circle,
          note: practiceLog.note,
          times: (practiceLog.practice_times || []).map((time: any) => ({
            id: time.id,
            userId: time.user_id || userId, // フォールバック
            practiceLogId: time.practice_log_id,
            repNumber: time.rep_number,
            setNumber: time.set_number,
            time: time.time,
            createdAt: time.created_at,
            updatedAt: time.updated_at
          })),
          createdAt: practiceLog.created_at,
          updatedAt: practiceLog.updated_at
        }
        
        return transformedLog
        
      } catch (error) {
        throw error
      }
    },

    updatePracticeLog: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      const userId = getUserId(context)
      
      const updateData: any = {}
      if (input.date) updateData.date = input.date
      if (input.place !== undefined) updateData.place = input.place
      if (input.style !== undefined) updateData.style = input.style
      if (input.repCount) updateData.rep_count = input.repCount
      if (input.setCount) updateData.set_count = input.setCount
      if (input.distance) updateData.distance = input.distance
      if (input.circle) updateData.circle = input.circle
      if (input.note !== undefined) updateData.note = input.note
      
      const { data, error } = await supabase
        .from('practice_logs')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select(`
          *,
          practice_times(*)
        `)
        .single()
      
      if (error) throw new Error(error.message)
      
      // GraphQLスキーマに合わせてフィールド名を変換
      return {
        id: data.id,
        userId: data.user_id || userId, // フォールバック
        date: data.date,
        place: data.place,
        style: data.style,
        repCount: data.rep_count,
        setCount: data.set_count,
        distance: data.distance,
        circle: data.circle,
        note: data.note,
        times: (data.practice_times || []).map((time: any) => ({
          id: time.id,
          userId: time.user_id || userId, // フォールバック
          practiceLogId: time.practice_log_id,
          repNumber: time.rep_number,
          setNumber: time.set_number,
          time: time.time,
          createdAt: time.created_at,
          updatedAt: time.updated_at
        })),
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    deletePracticeLog: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { error } = await supabase
        .from('practice_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw new Error(error.message)
      return true
    },

    // 練習タイム関連
    createPracticeTime: async (_: any, { input }: { input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_times')
        .insert({
          user_id: userId,
          practice_log_id: input.practiceLogId,
          rep_number: input.repNumber,
          set_number: input.setNumber,
          time: input.time
        })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      
      // GraphQLスキーマに合わせてフィールド名を変換
      return {
        id: data.id,
        userId: data.user_id,
        practiceLogId: data.practice_log_id,
        repNumber: data.rep_number,
        setNumber: data.set_number,
        time: data.time,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },

    updatePracticeTime: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_times')
        .update(input)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    deletePracticeTime: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { error } = await supabase
        .from('practice_times')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw new Error(error.message)
      return true
    },

    // 大会関連
    createCompetition: async (_: any, { input }: { input: any }, context: any) => {
      const { data, error } = await supabase
        .from('competitions')
        .insert({
          title: input.title,
          date: input.date,
          place: input.place,
          pool_type: input.poolType || 0,
          note: input.note
        })
        .select()
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      // データベースのフィールド名をGraphQLスキーマに合わせて変換
      return {
        id: data.id,
        title: data.title,
        date: data.date,
        place: data.place,
        poolType: data.pool_type,
        note: data.note
      }
    },

    updateCompetition: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('competitions')
        .update(input)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    deleteCompetition: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { error } = await supabase
        .from('competitions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw new Error(error.message)
      return true
    },

    // 記録関連
    createRecord: async (_: any, { input }: { input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('records')
        .insert({
          user_id: userId,
          competition_id: input.competitionId,
          style_id: input.styleId,
          time: input.time,
          video_url: input.videoUrl,
          note: input.note
        })
        .select(`
          *,
          styles(*),
          competitions(*)
        `)
        .single()
      
      if (error) throw new Error(error.message)
      
      // SplitTimeが提供されている場合、それらを作成
      if (input.splitTimes && input.splitTimes.length > 0) {
        const splitTimeInserts = input.splitTimes.map((splitTime: any) => ({
          record_id: data.id,
          distance: splitTime.distance,
          split_time: splitTime.splitTime
        }))
        
        const { error: splitTimeError } = await supabase
          .from('split_times')
          .insert(splitTimeInserts)
        
        if (splitTimeError) {
          console.error('SplitTime作成でエラーが発生しました:', splitTimeError)
          // SplitTimeの作成に失敗してもRecordは作成済みなので、エラーは投げない
        }
      }
      
      // データベースのフィールド名をGraphQLスキーマに合わせて変換
      const strokeMapping: { [key: string]: string } = {
        'fr': 'FREESTYLE',
        'br': 'BREASTSTROKE', 
        'ba': 'BACKSTROKE',
        'fly': 'BUTTERFLY',
        'im': 'INDIVIDUAL_MEDLEY'
      }
      
      return {
        id: data.id,
        userId: data.user_id,
        competitionId: data.competition_id,
        styleId: data.style_id,
        time: data.time,
        videoUrl: data.video_url,
        note: data.note,
        style: data.styles ? {
          id: data.styles.id,
          nameJp: data.styles.name_jp,
          name: data.styles.name,
          stroke: strokeMapping[data.styles.style] || 'FREESTYLE',
          distance: data.styles.distance
        } : null,
        competition: data.competitions ? {
          id: data.competitions.id,
          title: data.competitions.title,
          date: data.competitions.date,
          place: data.competitions.place,
          poolType: data.competitions.pool_type
        } : null,
        // 非Null型のため、必ず配列を返す
        splitTimes: await (async () => {
          try {
            const { data: splitRows, error: splitFetchError } = await supabase
              .from('split_times')
              .select('*')
              .eq('record_id', data.id)

            if (splitFetchError || !splitRows) return []
            return splitRows.map((split: any) => ({
              id: split.id,
              recordId: split.record_id,
              distance: split.distance,
              splitTime: split.split_time,
            }))
          } catch (_err) {
            return []
          }
        })()
      }
    },

    updateRecord: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      const userId = getUserId(context)
      
      // camelCaseからsnake_caseに変換
      const updateData: any = {}
      if (input.competitionId !== undefined) updateData.competition_id = input.competitionId
      if (input.styleId !== undefined) updateData.style_id = input.styleId
      if (input.time !== undefined) updateData.time = input.time
      if (input.videoUrl !== undefined) updateData.video_url = input.videoUrl
      if (input.note !== undefined) updateData.note = input.note
      
      const { data, error } = await supabase
        .from('records')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select(`
          *,
          styles(*),
          competitions(*)
        `)
        .single()
      
      if (error) throw new Error(error.message)
      
      // SplitTimeが提供されている場合、既存のSplitTimeを削除して新しいものを作成
      if (input.splitTimes !== undefined) {
        // 既存のSplitTimeを削除
        const { error: deleteError } = await supabase
          .from('split_times')
          .delete()
          .eq('record_id', id)
        
        if (deleteError) {
          console.error('SplitTime削除でエラーが発生しました:', deleteError)
        }
        
        // 新しいSplitTimeを作成
        if (input.splitTimes && input.splitTimes.length > 0) {
          const splitTimeInserts = input.splitTimes.map((splitTime: any) => ({
            record_id: id,
            distance: splitTime.distance,
            split_time: splitTime.splitTime
          }))
          
          const { error: splitTimeError } = await supabase
            .from('split_times')
            .insert(splitTimeInserts)
          
          if (splitTimeError) {
            console.error('SplitTime作成でエラーが発生しました:', splitTimeError)
          }
        }
      }
      
      // データベースのフィールド名をGraphQLスキーマに合わせて変換
      const strokeMapping: { [key: string]: string } = {
        'fr': 'FREESTYLE',
        'br': 'BREASTSTROKE', 
        'ba': 'BACKSTROKE',
        'fly': 'BUTTERFLY',
        'im': 'INDIVIDUAL_MEDLEY'
      }
      
      return {
        id: data.id,
        userId: data.user_id,
        competitionId: data.competition_id,
        styleId: data.style_id,
        time: data.time,
        videoUrl: data.video_url,
        note: data.note,
        style: data.styles ? {
          id: data.styles.id,
          nameJp: data.styles.name_jp,
          name: data.styles.name,
          stroke: strokeMapping[data.styles.style] || 'FREESTYLE',
          distance: data.styles.distance
        } : null,
        competition: data.competitions ? {
          id: data.competitions.id,
          title: data.competitions.title,
          date: data.competitions.date,
          place: data.competitions.place,
          poolType: data.competitions.pool_type
        } : null,
        // 非Null型のため、必ず配列を返す
        splitTimes: await (async () => {
          try {
            const { data: splitRows, error: splitFetchError } = await supabase
              .from('split_times')
              .select('*')
              .eq('record_id', data.id)

            if (splitFetchError || !splitRows) return []
            return splitRows.map((split: any) => ({
              id: split.id,
              recordId: split.record_id,
              distance: split.distance,
              splitTime: split.split_time,
            }))
          } catch (_err) {
            return []
          }
        })()
      }
    },

    deleteRecord: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      // まず削除対象のRecordを取得してcompetition_idを確認
      const { data: recordData, error: recordError } = await supabase
        .from('records')
        .select('competition_id')
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (recordError) throw new Error(recordError.message)
      
      // 関連するSplitTimeを削除
      const { error: splitTimeDeleteError } = await supabase
        .from('split_times')
        .delete()
        .eq('record_id', id)
      
      if (splitTimeDeleteError) {
        console.error('SplitTime削除でエラーが発生しました:', splitTimeDeleteError)
      }
      
      // Recordを削除
      const { error: deleteError } = await supabase
        .from('records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (deleteError) throw new Error(deleteError.message)
      
      // Competitionが存在し、かつそのCompetitionを参照している他のRecordがない場合、Competitionも削除
      if (recordData.competition_id) {
        const { data: otherRecords, error: checkError } = await supabase
          .from('records')
          .select('id')
          .eq('competition_id', recordData.competition_id)
          .limit(1)
        
        if (checkError) {
          console.error('Competition参照チェックでエラーが発生しました:', checkError)
        } else if (!otherRecords || otherRecords.length === 0) {
          // 他のRecordがこのCompetitionを参照していない場合、Competitionを削除
          const { error: competitionDeleteError } = await supabase
            .from('competitions')
            .delete()
            .eq('id', recordData.competition_id)
          
          if (competitionDeleteError) {
            console.error('Competition削除でエラーが発生しました:', competitionDeleteError)
            // Competition削除の失敗は警告のみ（Recordは既に削除済み）
          }
        }
      }
      
      return true
    },

    // スプリットタイム関連
    createSplitTime: async (_: any, { input }: { input: any }, context: any) => {
      const { data, error } = await supabase
        .from('split_times')
        .insert({
          record_id: input.recordId,
          distance: input.distance,
          split_time: input.splitTime
        })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      
      // snake_caseからcamelCaseにマッピング
      return {
        id: data.id,
        recordId: data.record_id,
        distance: data.distance,
        splitTime: data.split_time
      }
    },

    updateSplitTime: async (_: any, { id, input }: { id: string, input: any }) => {
      const { data, error } = await supabase
        .from('split_times')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      
      // snake_caseからcamelCaseにマッピング
      return {
        id: data.id,
        recordId: data.record_id,
        distance: data.distance,
        splitTime: data.split_time
      }
    },

    deleteSplitTime: async (_: any, { id }: { id: string }) => {
      const { error } = await supabase
        .from('split_times')
        .delete()
        .eq('id', id)
      
      if (error) throw new Error(error.message)
      return true
    },

    // 個人目標関連
    createPersonalGoal: async (_: any, { input }: { input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('personal_goals')
        .insert({
          user_id: userId,
          goal_type: input.goalType,
          style_id: input.styleId,
          pool_type: input.poolType,
          target_time: input.targetTime,
          title: input.title,
          description: input.description,
          target_date: input.targetDate,
          start_date: input.startDate || formatDate(new Date())
        })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    updatePersonalGoal: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('personal_goals')
        .update(input)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    deletePersonalGoal: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { error } = await supabase
        .from('personal_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw new Error(error.message)
      return true
    },

    // 目標進捗関連
    createGoalProgress: async (_: any, { input }: { input: any }, context: any) => {
      const { data, error } = await supabase
        .from('goal_progress')
        .insert({
          personal_goal_id: input.personalGoalId,
          progress_date: input.progressDate,
          progress_value: input.progressValue,
          progress_note: input.progressNote
        })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    updateGoalProgress: async (_: any, { id, input }: { id: string, input: any }) => {
      const { data, error } = await supabase
        .from('goal_progress')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    deleteGoalProgress: async (_: any, { id }: { id: string }) => {
      const { error } = await supabase
        .from('goal_progress')
        .delete()
        .eq('id', id)
      
      if (error) throw new Error(error.message)
      return true
    },

    // ユーザー関連
    updateProfile: async (_: any, { input }: { input: any }, context: any) => {
      const userId = getUserId(context)
      
      try {
        console.log('Updating profile for user:', userId, 'with input:', input)
        
        const updateData: any = {}
        if (input.name !== undefined) updateData.name = input.name
        if (input.gender !== undefined) updateData.gender = input.gender
        if (input.birthday !== undefined) updateData.birthday = input.birthday
        if (input.bio !== undefined) updateData.bio = input.bio
        if (input.profileImagePath !== undefined) updateData.profile_image_path = input.profileImagePath
        
        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single()
        
        console.log('Profile update result:', { data, error })
        
        if (error) {
          console.error('Profile update error:', error)
          throw new Error(error.message)
        }
        
        // データベースのフィールド名をGraphQLスキーマに合わせて変換
        return {
          id: data.id,
          userId: data.id,
          name: data.name,
          gender: data.gender,
          profileImagePath: data.profile_image_path,
          birthday: data.birthday,
          bio: data.bio,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      } catch (err) {
        console.error('UpdateProfile resolver error:', err)
        throw err
      }
    }
  }
}
