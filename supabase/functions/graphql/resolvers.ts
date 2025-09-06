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
    // 種目・泳法関連
    styles: async () => {
      try {
        console.log('Fetching styles...')
        const { data, error } = await supabase
          .from('styles')
          .select('id, name_jp, name, distance, style, created_at, updated_at')
          .order('distance')
        
        console.log('Styles query result:', { data, error })
        
        if (error) {
          console.error('Styles query error:', error)
          throw new Error(error.message)
        }
        
        if (!data) {
          console.log('No styles data returned')
          return []
        }
        
        console.log('Raw styles data:', data)
        
        // データベースのフィールド名をGraphQLスキーマに合わせて変換
        const transformedData = data.map((style: any) => ({
          id: style.id,
          nameJp: style.name_jp,
          name: style.name,
          distance: style.distance,
          stroke: ['FREESTYLE', 'BACKSTROKE', 'BREASTSTROKE', 'BUTTERFLY', 'INDIVIDUAL_MEDLEY'][style.style] || 'FREESTYLE',
          createdAt: style.created_at,
          updatedAt: style.updated_at
        }))
        
        console.log('Transformed styles data:', transformedData)
        return transformedData
      } catch (err) {
        console.error('Styles resolver error:', err)
        throw err
      }
    },

    style: async (_: any, { id }: { id: string }) => {
      const { data, error } = await supabase
        .from('styles')
        .select('id, name_jp, name, distance, style, created_at, updated_at')
        .eq('id', id)
        .single()
      
      if (error) throw new Error(error.message)
      
      // データベースのフィールド名をGraphQLスキーマに合わせて変換
      return {
        id: data.id,
        nameJp: data.name_jp,
        name: data.name,
        distance: data.distance,
        stroke: ['FREESTYLE', 'BACKSTROKE', 'BREASTSTROKE', 'BUTTERFLY', 'INDIVIDUAL_MEDLEY'][data.style] || 'FREESTYLE',
        createdAt: data.created_at,
        updatedAt: data.updated_at
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
          practice_log_tags!inner(
            practice_tags(*)
          ),
          practice_times(*)
        `)
        .eq('user_id', userId)
        .order('practice_date', { ascending: false })
      
      if (startDate) {
        query = query.gte('practice_date', startDate)
      }
      if (endDate) {
        query = query.lte('practice_date', endDate)
      }
      
      const { data, error } = await query
      
      if (error) throw new Error(error.message)
      return data || []
    },

    practiceLog: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_logs')
        .select(`
          *,
          practice_log_tags!inner(
            practice_tags(*)
          ),
          practice_times(*)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    practiceLogsByDate: async (_: any, { date }: { date: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_logs')
        .select(`
          *,
          practice_log_tags!inner(
            practice_tags(*)
          ),
          practice_times(*)
        `)
        .eq('user_id', userId)
        .eq('practice_date', date)
        .order('created_at')
      
      if (error) throw new Error(error.message)
      return data || []
    },

    // 大会関連
    myCompetitions: async (_: any, __: any, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('competitions')
        .select(`
          *,
          records(*)
        `)
        .eq('user_id', userId)
        .order('competition_date', { ascending: false })
      
      if (error) throw new Error(error.message)
      return data || []
    },

    competition: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('competitions')
        .select(`
          *,
          records(*)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    // 記録関連
    myRecords: async (_: any, { startDate, endDate, styleId, poolType }: {
      startDate?: string,
      endDate?: string,
      styleId?: string,
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
        .order('record_date', { ascending: false })
      
      if (startDate) {
        query = query.gte('record_date', startDate)
      }
      if (endDate) {
        query = query.lte('record_date', endDate)
      }
      if (styleId) {
        query = query.eq('style_id', styleId)
      }
      if (poolType !== undefined) {
        query = query.eq('pool_type', poolType)
      }
      
      const { data, error } = await query
      
      if (error) throw new Error(error.message)
      return data || []
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
      return data
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
        .eq('record_date', date)
        .order('created_at')
      
      if (error) throw new Error(error.message)
      return data || []
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
        .select('practice_date')
        .eq('user_id', userId)
        .gte('practice_date', startDateStr)
        .lte('practice_date', endDateStr)
      
      if (practiceError) throw new Error(practiceError.message)
      
      // 記録を取得
      const { data: records, error: recordsError } = await supabase
        .from('records')
        .select('record_date')
        .eq('user_id', userId)
        .gte('record_date', startDateStr)
        .lte('record_date', endDateStr)
      
      if (recordsError) throw new Error(recordsError.message)
      
      // 日付別のデータを集計
      const practicesByDate = new Map<string, number>()
      const recordsByDate = new Map<string, number>()
      
      practiceLogs?.forEach(log => {
        const date = log.practice_date
        practicesByDate.set(date, (practicesByDate.get(date) || 0) + 1)
      })
      
      records?.forEach(record => {
        const date = record.record_date
        recordsByDate.set(date, (recordsByDate.get(date) || 0) + 1)
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
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('practice_logs')
        .insert({
          user_id: userId,
          practice_date: input.practiceDate,
          location: input.location,
          style: input.style,
          rep_count: input.repCount,
          set_count: input.setCount,
          distance: input.distance,
          circle: input.circle,
          note: input.note
        })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      
      // タグの関連付け
      if (input.tagIds && input.tagIds.length > 0) {
        const tagRelations = input.tagIds.map((tagId: string) => ({
          practice_log_id: data.id,
          practice_tag_id: tagId
        }))
        
        await supabase
          .from('practice_log_tags')
          .insert(tagRelations)
      }
      
      return data
    },

    updatePracticeLog: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      const userId = getUserId(context)
      
      const updateData: any = {}
      if (input.practiceDate) updateData.practice_date = input.practiceDate
      if (input.location !== undefined) updateData.location = input.location
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
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      
      // タグの更新
      if (input.tagIds !== undefined) {
        // 既存のタグ関連を削除
        await supabase
          .from('practice_log_tags')
          .delete()
          .eq('practice_log_id', id)
        
        // 新しいタグ関連を追加
        if (input.tagIds.length > 0) {
          const tagRelations = input.tagIds.map((tagId: string) => ({
            practice_log_id: id,
            practice_tag_id: tagId
          }))
          
          await supabase
            .from('practice_log_tags')
            .insert(tagRelations)
        }
      }
      
      return data
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
      return data
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
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('competitions')
        .insert({
          user_id: userId,
          name: input.name,
          competition_date: input.competitionDate,
          location: input.location,
          pool_type: input.poolType,
          pool_length: input.poolLength,
          competition_category: input.competitionCategory
        })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
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
          style_id: input.styleId,
          time: input.time,
          record_date: input.recordDate,
          location: input.location,
          pool_type: input.poolType,
          pool_length: input.poolLength,
          is_relay: input.isRelay || false,
          rank_position: input.rankPosition,
          memo: input.memo,
          video_url: input.videoUrl,
          competition_id: input.competitionId
        })
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    updateRecord: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      const userId = getUserId(context)
      
      const { data, error } = await supabase
        .from('records')
        .update(input)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
    },

    deleteRecord: async (_: any, { id }: { id: string }, context: any) => {
      const userId = getUserId(context)
      
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      
      if (error) throw new Error(error.message)
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
      return data
    },

    updateSplitTime: async (_: any, { id, input }: { id: string, input: any }) => {
      const { data, error } = await supabase
        .from('split_times')
        .update(input)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data
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
    }
  }
}
