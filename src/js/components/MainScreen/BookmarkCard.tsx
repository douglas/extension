import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { Bookmark } from '~/types/Bookmark'
import styled from 'styled-components'
import { actions as editingActions } from '~/store/modules/editing'
import { removeBookmarkThunk } from '~/store/modules/bookmarks'
import { navigate } from '~/store/modules/navigation'
import { useDispatch, useSelector } from 'react-redux'

import EditIcon from '~/icons/edit'
import DeleteIcon from '~/icons/delete'
import { getBackupReadOnly } from '~/store/modules/backup'

export const BookmarkCard = (bookmark: Bookmark) => {
  const dispatch = useDispatch()
  const backupReadOnly = useSelector(getBackupReadOnly)

  const onEdit = () => {
    dispatch(editingActions.setEditing(bookmark))
    dispatch(navigate('add'))
  }

  const onRemove = () => dispatch(removeBookmarkThunk(bookmark.guid))

  return (
    <Card>
      <FlexCol>
        <Link href={bookmark.href}>{bookmark.name}</Link>
        <SmallLink href={bookmark.href}>{bookmark.href}</SmallLink>
      </FlexCol>
      <FlexRow>
        {!backupReadOnly && (
          <>
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onRemove}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </FlexRow>
    </Card>
  )
}

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.75em;
  padding-bottom: 0.75em;
  padding-left: 0.1em;
  border-bottom: 1.5px solid #c9d6df;
`

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
`

const FlexRow = styled.div`
  display: flex;
  flex-dirction: row;
`

const Link = styled.a`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 375px;
  font-size: 18px;
  text-decoration: none;
  font-family: Roboto;
  line-height: 1.5em;
  padding-left: 0.25em;
  color: #424242;
  :visited {
    color: #424242;
  }
  :hover {
    color: #0277bd;
  }
`

const SmallLink = styled(Link)`
  font-size: 12.5px;
`
