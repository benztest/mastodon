import api       from '../api'
import Immutable from 'immutable';

export const ACCOUNT_SET_SELF = 'ACCOUNT_SET_SELF';

export const ACCOUNT_FETCH_REQUEST = 'ACCOUNT_FETCH_REQUEST';
export const ACCOUNT_FETCH_SUCCESS = 'ACCOUNT_FETCH_SUCCESS';
export const ACCOUNT_FETCH_FAIL    = 'ACCOUNT_FETCH_FAIL';

export const ACCOUNT_FOLLOW_REQUEST = 'ACCOUNT_FOLLOW_REQUEST';
export const ACCOUNT_FOLLOW_SUCCESS = 'ACCOUNT_FOLLOW_SUCCESS';
export const ACCOUNT_FOLLOW_FAIL    = 'ACCOUNT_FOLLOW_FAIL';

export const ACCOUNT_UNFOLLOW_REQUEST = 'ACCOUNT_UNFOLLOW_REQUEST';
export const ACCOUNT_UNFOLLOW_SUCCESS = 'ACCOUNT_UNFOLLOW_SUCCESS';
export const ACCOUNT_UNFOLLOW_FAIL    = 'ACCOUNT_UNFOLLOW_FAIL';

export const ACCOUNT_BLOCK_REQUEST = 'ACCOUNT_BLOCK_REQUEST';
export const ACCOUNT_BLOCK_SUCCESS = 'ACCOUNT_BLOCK_SUCCESS';
export const ACCOUNT_BLOCK_FAIL    = 'ACCOUNT_BLOCK_FAIL';

export const ACCOUNT_UNBLOCK_REQUEST = 'ACCOUNT_UNBLOCK_REQUEST';
export const ACCOUNT_UNBLOCK_SUCCESS = 'ACCOUNT_UNBLOCK_SUCCESS';
export const ACCOUNT_UNBLOCK_FAIL    = 'ACCOUNT_UNBLOCK_FAIL';

export const ACCOUNT_TIMELINE_FETCH_REQUEST = 'ACCOUNT_TIMELINE_FETCH_REQUEST';
export const ACCOUNT_TIMELINE_FETCH_SUCCESS = 'ACCOUNT_TIMELINE_FETCH_SUCCESS';
export const ACCOUNT_TIMELINE_FETCH_FAIL    = 'ACCOUNT_TIMELINE_FETCH_FAIL';

export const ACCOUNT_TIMELINE_EXPAND_REQUEST = 'ACCOUNT_TIMELINE_EXPAND_REQUEST';
export const ACCOUNT_TIMELINE_EXPAND_SUCCESS = 'ACCOUNT_TIMELINE_EXPAND_SUCCESS';
export const ACCOUNT_TIMELINE_EXPAND_FAIL    = 'ACCOUNT_TIMELINE_EXPAND_FAIL';

export const FOLLOWERS_FETCH_REQUEST = 'FOLLOWERS_FETCH_REQUEST';
export const FOLLOWERS_FETCH_SUCCESS = 'FOLLOWERS_FETCH_SUCCESS';
export const FOLLOWERS_FETCH_FAIL    = 'FOLLOWERS_FETCH_FAIL';

export const FOLLOWING_FETCH_REQUEST = 'FOLLOWING_FETCH_REQUEST';
export const FOLLOWING_FETCH_SUCCESS = 'FOLLOWING_FETCH_SUCCESS';
export const FOLLOWING_FETCH_FAIL    = 'FOLLOWING_FETCH_FAIL';

export const RELATIONSHIPS_FETCH_REQUEST = 'RELATIONSHIPS_FETCH_REQUEST';
export const RELATIONSHIPS_FETCH_SUCCESS = 'RELATIONSHIPS_FETCH_SUCCESS';
export const RELATIONSHIPS_FETCH_FAIL    = 'RELATIONSHIPS_FETCH_FAIL';

export function setAccountSelf(account) {
  return {
    type: ACCOUNT_SET_SELF,
    account: account
  };
};

export function fetchAccount(id) {
  return (dispatch, getState) => {
    dispatch(fetchAccountRequest(id));

    api(getState).get(`/api/v1/accounts/${id}`).then(response => {
      dispatch(fetchAccountSuccess(response.data));
      dispatch(fetchRelationships([id]));
    }).catch(error => {
      dispatch(fetchAccountFail(id, error));
    });
  };
};

export function fetchAccountTimeline(id, replace = false) {
  return (dispatch, getState) => {
    dispatch(fetchAccountTimelineRequest(id));

    const ids      = getState().getIn(['timelines', 'accounts_timelines', id], Immutable.List());
    const newestId = ids.size > 0 ? ids.first() : null;

    let params = '';

    if (newestId !== null && !replace) {
      params = `?since_id=${newestId}`;
    }

    api(getState).get(`/api/v1/accounts/${id}/statuses${params}`).then(response => {
      dispatch(fetchAccountTimelineSuccess(id, response.data, replace));
    }).catch(error => {
      dispatch(fetchAccountTimelineFail(id, error));
    });
  };
};

export function expandAccountTimeline(id) {
  return (dispatch, getState) => {
    const lastId = getState().getIn(['timelines', 'accounts_timelines', id], Immutable.List()).last();

    dispatch(expandAccountTimelineRequest(id));

    api(getState).get(`/api/v1/accounts/${id}/statuses?max_id=${lastId}`).then(response => {
      dispatch(expandAccountTimelineSuccess(id, response.data));
    }).catch(error => {
      dispatch(expandAccountTimelineFail(id, error));
    });
  };
};

export function fetchAccountRequest(id) {
  return {
    type: ACCOUNT_FETCH_REQUEST,
    id: id
  };
};

export function fetchAccountSuccess(account) {
  return {
    type: ACCOUNT_FETCH_SUCCESS,
    account: account
  };
};

export function fetchAccountFail(id, error) {
  return {
    type: ACCOUNT_FETCH_FAIL,
    id: id,
    error: error
  };
};

export function followAccount(id) {
  return (dispatch, getState) => {
    dispatch(followAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/follow`).then(response => {
      dispatch(followAccountSuccess(response.data));
    }).catch(error => {
      dispatch(followAccountFail(error));
    });
  };
};

export function unfollowAccount(id) {
  return (dispatch, getState) => {
    dispatch(unfollowAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/unfollow`).then(response => {
      dispatch(unfollowAccountSuccess(response.data));
    }).catch(error => {
      dispatch(unfollowAccountFail(error));
    });
  }
};

export function followAccountRequest(id) {
  return {
    type: ACCOUNT_FOLLOW_REQUEST,
    id: id
  };
};

export function followAccountSuccess(relationship) {
  return {
    type: ACCOUNT_FOLLOW_SUCCESS,
    relationship: relationship
  };
};

export function followAccountFail(error) {
  return {
    type: ACCOUNT_FOLLOW_FAIL,
    error: error
  };
};

export function unfollowAccountRequest(id) {
  return {
    type: ACCOUNT_UNFOLLOW_REQUEST,
    id: id
  };
};

export function unfollowAccountSuccess(relationship) {
  return {
    type: ACCOUNT_UNFOLLOW_SUCCESS,
    relationship: relationship
  };
};

export function unfollowAccountFail(error) {
  return {
    type: ACCOUNT_UNFOLLOW_FAIL,
    error: error
  };
};

export function fetchAccountTimelineRequest(id) {
  return {
    type: ACCOUNT_TIMELINE_FETCH_REQUEST,
    id: id
  };
};

export function fetchAccountTimelineSuccess(id, statuses, replace) {
  return {
    type: ACCOUNT_TIMELINE_FETCH_SUCCESS,
    id: id,
    statuses: statuses,
    replace: replace
  };
};

export function fetchAccountTimelineFail(id, error) {
  return {
    type: ACCOUNT_TIMELINE_FETCH_FAIL,
    id: id,
    error: error
  };
};

export function expandAccountTimelineRequest(id) {
  return {
    type: ACCOUNT_TIMELINE_EXPAND_REQUEST,
    id: id
  };
};

export function expandAccountTimelineSuccess(id, statuses) {
  return {
    type: ACCOUNT_TIMELINE_EXPAND_SUCCESS,
    id: id,
    statuses: statuses
  };
};

export function expandAccountTimelineFail(id, error) {
  return {
    type: ACCOUNT_TIMELINE_EXPAND_FAIL,
    id: id,
    error: error
  };
};

export function blockAccount(id) {
  return (dispatch, getState) => {
    dispatch(blockAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/block`).then(response => {
      dispatch(blockAccountSuccess(response.data));
    }).catch(error => {
      dispatch(blockAccountFail(id, error));
    });
  };
};

export function unblockAccount(id) {
  return (dispatch, getState) => {
    dispatch(unblockAccountRequest(id));

    api(getState).post(`/api/v1/accounts/${id}/unblock`).then(response => {
      dispatch(unblockAccountSuccess(response.data));
    }).catch(error => {
      dispatch(unblockAccountFail(id, error));
    });
  };
};

export function blockAccountRequest(id) {
  return {
    type: ACCOUNT_BLOCK_REQUEST,
    id: id
  };
};

export function blockAccountSuccess(relationship) {
  return {
    type: ACCOUNT_BLOCK_SUCCESS,
    relationship: relationship
  };
};

export function blockAccountFail(error) {
  return {
    type: ACCOUNT_BLOCK_FAIL,
    error: error
  };
};

export function unblockAccountRequest(id) {
  return {
    type: ACCOUNT_UNBLOCK_REQUEST,
    id: id
  };
};

export function unblockAccountSuccess(relationship) {
  return {
    type: ACCOUNT_UNBLOCK_SUCCESS,
    relationship: relationship
  };
};

export function unblockAccountFail(error) {
  return {
    type: ACCOUNT_UNBLOCK_FAIL,
    error: error
  };
};

export function fetchFollowers(id) {
  return (dispatch, getState) => {
    dispatch(fetchFollowersRequest(id));

    api(getState).get(`/api/v1/accounts/${id}/followers`).then(response => {
      dispatch(fetchFollowersSuccess(id, response.data));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchFollowersFail(id, error));
    });
  };
};

export function fetchFollowersRequest(id) {
  return {
    type: FOLLOWERS_FETCH_REQUEST,
    id: id
  };
};

export function fetchFollowersSuccess(id, accounts) {
  return {
    type: FOLLOWERS_FETCH_SUCCESS,
    id: id,
    accounts: accounts
  };
};

export function fetchFollowersFail(id, error) {
  return {
    type: FOLLOWERS_FETCH_FAIL,
    id: id,
    error: error
  };
};

export function fetchFollowing(id) {
  return (dispatch, getState) => {
    dispatch(fetchFollowingRequest(id));

    api(getState).get(`/api/v1/accounts/${id}/following`).then(response => {
      dispatch(fetchFollowingSuccess(id, response.data));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchFollowingFail(id, error));
    });
  };
};

export function fetchFollowingRequest(id) {
  return {
    type: FOLLOWING_FETCH_REQUEST,
    id: id
  };
};

export function fetchFollowingSuccess(id, accounts) {
  return {
    type: FOLLOWING_FETCH_SUCCESS,
    id: id,
    accounts: accounts
  };
};

export function fetchFollowingFail(id, error) {
  return {
    type: FOLLOWING_FETCH_FAIL,
    id: id,
    error: error
  };
};

export function fetchRelationships(account_ids) {
  return (dispatch, getState) => {
    dispatch(fetchRelationshipsRequest(account_ids));

    api(getState).get(`/api/v1/accounts/relationships?${account_ids.map(id => `id[]=${id}`).join('&')}`).then(response => {
      dispatch(fetchRelationshipsSuccess(response.data));
    }).catch(error => {
      dispatch(fetchRelationshipsFail(error));
    });
  };
};

export function fetchRelationshipsRequest(ids) {
  return {
    type: RELATIONSHIPS_FETCH_REQUEST,
    ids: ids
  };
};

export function fetchRelationshipsSuccess(relationships) {
  return {
    type: RELATIONSHIPS_FETCH_SUCCESS,
    relationships: relationships
  };
};

export function fetchRelationshipsFail(error) {
  return {
    type: RELATIONSHIPS_FETCH_FAIL,
    error: error
  };
};
