using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;

namespace Hotels.Json_Converters
{
    public class TimeSpanConverter: JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            string value = reader.GetString()!;
            try
            {
                return TimeSpan.ParseExact(value, "h\\:mm", CultureInfo.InvariantCulture);
            }
            catch(Exception e)
            {
                throw new JsonException("Cannot convert object ${1} of given signature", e);
            }
        }

        public override void Write(
            Utf8JsonWriter writer,
            TimeSpan value,
            JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("h\\:mm", CultureInfo.InvariantCulture));
        }
    }
}
