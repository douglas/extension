import { AppAction, AppState, ThunkState, ThunkDispatch } from '~/types/redux'
import { getBookmarks } from './bookmarks'
import { getToken } from './auth'
import { transformExportBookmark, transformExportBookmarks } from '~/helpers'
import { createBackup } from '~/api/createBackup'
import { updateBackup } from '~/api/updateBackup'

export type BackupState = Partial<{
  backupLoading: boolean
  backupFilename: string
  backupDescription: string
  backupUrl: string
  backupGistID: string
}>

export const initialState: BackupState = {
  backupLoading: false,
}

export const actions = {
  setFilename: (filename: string) => ({
    type: 'SET_BACKUP_FILENAME',
    payload: filename,
  }),
  setDescription: (description: string) => ({
    type: 'SET_BACKUP_DESCRIPTION',
    payload: description,
  }),
  setUrl: (url: string) => ({
    type: 'SET_BACKUP_URL',
    payload: url,
  }),
  setGistId: (gistId: string) => ({
    type: 'SET_BACKUP_GIST_ID',
    payload: gistId,
  }),
  clearBackup: () => ({
    type: 'CLEAR_BACKUP',
  }),
  setLoading: (loading: boolean) => ({
    type: 'SET_LOADING',
    payload: loading,
  }),
}

export function reducer(state: BackupState = initialState, action: AppAction) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        backupLoading: action.payload,
      }
    case 'SET_BACKUP_FILENAME':
      return {
        ...state,
        backupFilename: action.payload,
      }
    case 'SET_BACKUP_DESCRIPTION':
      return {
        ...state,
        backupDescription: action.payload,
      }
    case 'SET_BACKUP_URL':
      return {
        ...state,
        backupUrl: action.payload,
      }
    case 'SET_BACKUP_GIST_ID':
      return {
        ...state,
        backupGistID: action.payload,
      }
    case 'CLEAR_BACKUP':
      return initialState
    default:
      return state
  }
}

export const getBackup = (state: AppState) => state.backup

export const getBackupFilename = (state: AppState) =>
  state.backup.backupFilename

export const getBackupDescription = (state: AppState) =>
  state.backup.backupDescription
export const getBackupUrl = (state: AppState) => state.backup.backupUrl

export const getBackupGistId = (state: AppState) => state.backup.backupGistID

export function createBackupThunk(filename: string, description?: string) {
  return async (dispatch: ThunkDispatch, getState: ThunkState) => {
    dispatch(actions.setLoading(true))
    const bookmarks = getBookmarks(getState())
    const token = getToken(getState())

    const minifiedBookmarks = transformExportBookmarks(bookmarks)

    // Add a .json to the end of the filename
    // TODO: We should check if the user has already done this
    const filenameWithExtension = `${filename}.json`

    if (token) {
      try {
        const resp = await createBackup(
          token,
          filenameWithExtension,
          false,
          minifiedBookmarks,
          description
        )

        const { id, html_url } = resp.data
        console.log(resp)

        dispatch(actions.setGistId(id))
        dispatch(actions.setUrl(html_url))
        dispatch(actions.setFilename(filenameWithExtension))

        if (description) {
          dispatch(actions.setDescription(description))
        }
        dispatch(actions.setLoading(false))
      } catch {
        alert('There was an error backing up your bookmarks')
      }
    } else {
      alert('Could not create backup, missing token')
    }
  }
}

export function updateBackupThunk() {
  return async (dispatch: ThunkDispatch, getState: ThunkState) => {
    dispatch(actions.setLoading(true))
    const bookmarks = getBookmarks(getState())
    const token = getToken(getState())
    const filename = getBackupFilename(getState())
    const description = getBackupDescription(getState())
    const gistId = getBackupGistId(getState())

    const minifiedBookmarks = transformExportBookmarks(bookmarks)

    if (token && filename && gistId) {
      try {
        await updateBackup(
          token,
          filename,
          false,
          minifiedBookmarks,
          gistId,
          description
        )
      } catch {
        alert('Could not update bookmarks')
      }
    } else {
      alert('Could not update bookmarks')
    }
  }
}
