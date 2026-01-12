import { supabase } from '../lib/supabase'

// Erstelle ein neues Match
export async function createMatch(creatorName) {
  // Generiere einen einfachen Seed aus Timestamp
  const seed = Date.now()
  
  const { data, error } = await supabase
    .from('matches')
    .insert([
      {
        creator_name: creatorName,
        seed: seed,
        status: 'waiting',
        creator_result: null,
        opponent_name: null,
        opponent_result: null
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating match:', error)
    throw error
  }

  return data
}

// Hole Match-Daten
export async function getMatch(matchId) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single()

  if (error) {
    console.error('Error fetching match:', error)
    throw error
  }

  return data
}

// Trete einem Match bei
export async function joinMatch(matchId, opponentName) {
  const { data, error } = await supabase
    .from('matches')
    .update({
      opponent_name: opponentName,
      status: 'playing'
    })
    .eq('id', matchId)
    .select()
    .single()

  if (error) {
    console.error('Error joining match:', error)
    throw error
  }

  return data
}

// Speichere Creator-Ergebnis
export async function submitCreatorResult(matchId, result) {
  const { data, error } = await supabase
    .from('matches')
    .update({
      creator_result: result,
      status: result.status || 'waiting'
    })
    .eq('id', matchId)
    .select()
    .single()

  if (error) {
    console.error('Error submitting creator result:', error)
    throw error
  }

  return data
}

// Speichere Opponent-Ergebnis
export async function submitOpponentResult(matchId, result) {
  const { data, error } = await supabase
    .from('matches')
    .update({
      opponent_result: result,
      status: 'finished'
    })
    .eq('id', matchId)
    .select()
    .single()

  if (error) {
    console.error('Error submitting opponent result:', error)
    throw error
  }

  return data
}
