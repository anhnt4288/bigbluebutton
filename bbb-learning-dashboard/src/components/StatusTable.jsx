import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getUserEmojisSummary, emojiConfigs } from '../services/EmojiService';
import UserAvatar from './UserAvatar';

class StatusTable extends React.Component {
  render() {
    const spanMinutes = 10 * 60000; // 10 minutes default
    const { allUsers, intl } = this.props;

    function tsToHHmmss(ts) {
      return (new Date(ts).toISOString().substr(11, 8));
    }

    const usersRegisteredTimes = Object.values(allUsers || {}).map((user) => user.registeredOn);
    const usersLeftTimes = Object.values(allUsers || {}).map((user) => {
      if (user.leftOn === 0) return (new Date()).getTime();
      return user.leftOn;
    });

    const firstRegisteredOnTime = Math.min(...usersRegisteredTimes);
    const lastLeftOnTime = Math.max(...usersLeftTimes);

    const periods = [];
    let currPeriod = firstRegisteredOnTime;
    while (currPeriod < lastLeftOnTime) {
      periods.push(currPeriod);
      currPeriod += spanMinutes;
    }

    return (
      <table className="w-full whitespace-no-wrap">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-100">
            <th className="px-4 py-3">
              <FormattedMessage id="app.learningDashboard.statusTimelineTable.colParticipant" defaultMessage="Participant" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 inline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </th>
            { periods.map((period) => <th className="px-4 py-3 text-left">{ `${tsToHHmmss(period - firstRegisteredOnTime)}` }</th>) }
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          { typeof allUsers === 'object' && Object.values(allUsers || {}).length > 0 ? (
            Object.values(allUsers || {})
              .map((user) => (
                <tr className="text-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <UserAvatar user={user} />
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  { periods.map((period) => {
                    const userEmojisInPeriod = getUserEmojisSummary(user,
                      null,
                      period,
                      period + spanMinutes);
                    return (
                      <td className="px-4 py-3 text-sm text-left">
                        {
                          user.registeredOn > period && user.registeredOn < period + spanMinutes
                            ? (
                              <span title={intl.formatDate(user.registeredOn, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-xs text-green-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                  />
                                </svg>
                              </span>
                            ) : null
                        }
                        { Object.keys(userEmojisInPeriod)
                          .map((emoji) => (
                            <div className="text-sm text-gray-800">
                              <i className={`${emojiConfigs[emoji].icon} text-sm`} />
                            &nbsp;
                              { userEmojisInPeriod[emoji] }
                            &nbsp;
                              <FormattedMessage
                                id={emojiConfigs[emoji].intlId}
                                defaultMessage={emojiConfigs[emoji].defaultMessage}
                              />
                            </div>
                          )) }
                        {
                          user.leftOn > period && user.leftOn < period + spanMinutes
                            ? (
                              <span title={intl.formatDate(user.leftOn, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-red-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                              </span>
                            ) : null
                        }
                      </td>
                    );
                  }) }
                </tr>
              ))) : null }
        </tbody>
      </table>
    );
  }
}

export default injectIntl(StatusTable);
